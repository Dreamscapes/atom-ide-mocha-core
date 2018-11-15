import { CompositeDisposable } from 'atom'
import fs from 'fs'
import path from 'path'
import { Consumer } from 'remote-event-emitter'
import * as util from './util'
import { config } from './config'
import { Session } from './session'

const HELP_TEMPLATE = fs.readFileSync(path.resolve(__dirname, 'static', 'help.md'), 'utf8')

class IdeMocha {
  config = config
  commands = {
    'ide-mocha:print-address-info': ::this.doPrintAddressInfo,
    'ide-mocha:copy-receiver-address': ::this.doCopyReceiverAddress,
    'ide-mocha:copy-mocha-command': ::this.doCopyMochaCommand,
    'ide-mocha:show-help': ::this.doShowHelp,
  }

  #subscriptions = null
  #busy = null
  #console = null
  #linter = null
  #remote = null

  #root = null
  #settings = null

  // LIFECYCLE

  async activate() {
    this.#root = atom.project.getPaths().shift()
    this.#settings = atom.config.get('ide-mocha')
    this.#settings.address = util.mkaddress({ root: this.#root, type: this.#settings.interface })

    this.#subscriptions = new CompositeDisposable()
    this.#subscriptions.add(atom.commands.add('atom-workspace', this.commands))
    this.#subscriptions.add(atom.config.onDidChange('ide-mocha', ::this.didChangeConfig))

    if (typeof this.#settings.address === 'string') {
      // Ensure the socket does not exist before we bind to it. And yes, just ignore any errors
      // thrown here. If the file does not exist it's all good and if we cannot unlink it then well,
      // we can't really do anything anyway and we will instead throw during bind.
      await new Promise(resolve => fs.unlink(this.#settings.address, () => resolve()))
    }

    this.#remote = new Consumer()
    this.#remote.on('connection', ::this.didReceiveConnection)
    await this.#remote.listen({ address: this.#settings.address })
  }

  async deactivate() {
    await this.#remote.close()
    this.#subscriptions.dispose()
    this.#subscriptions = null
    this.#busy = null
    this.#console = null
    this.#linter = null
    this.#remote = null
    this.#settings = null
    this.#root = null
  }

  // CONSUMED SERVICES

  consumeBusySignal(busy) {
    this.#busy = busy
    this.#subscriptions.add(this.#busy)
  }

  consumeConsole(mkconsole) {
    this.#console = mkconsole({
      id: 'IDE-Mocha',
      name: 'IDE-Mocha',
    })
    this.#subscriptions.add(this.#console)
  }

  consumeLinter(mklinter) {
    this.#linter = mklinter({
      name: 'IDE-Mocha',
    })
    this.#subscriptions.add(this.#linter)
  }


  // COMMANDS

  doPrintAddressInfo() {
    const address = util.mkaddressinfo({ address: this.#remote.address() })
    const type = this.#settings.interface

    this.#console.info(`Listening (${type}): ${address}`)
    return util.openConsole()
  }

  doCopyReceiverAddress() {
    atom.clipboard.write(this.#settings.address)
    atom.notifications.addSuccess('Copied!', {
      description: '**IDE-Mocha**',
    })
  }

  doCopyMochaCommand() {
    const address = this.#settings.address
    const command = util.mkcommandinfo({ address })

    atom.clipboard.write(command)
    atom.notifications.addSuccess('Copied!', {
      description: '**IDE-Mocha**',
    })
  }

  doShowHelp() {
    const address = this.#settings.address
    const command = util.mkcommandinfo({ address })
    const help = HELP_TEMPLATE.replace('#{COMMAND}', command)

    atom.notifications.addInfo('IDE-Mocha: Help', {
      description: help,
      icon: 'mortar-board',
      dismissable: true,
      buttons: [{
        // Extra space to make room between the clippy icon and text 🎨
        text: ' Copy Mocha command to clipboard',
        className: 'btn btn-info icon-clippy selected',
        onDidClick() {
          atom.clipboard.write(command)
          atom.notifications.addSuccess('Copied!', {
            description: '**IDE-Mocha**',
          })
        },
      }],
    })
  }


  // TEST RESULTS NOTIFICATIONS

  showSuccessNotification({ stats }) {
    atom.notifications.addSuccess('Test suite passed.', {
      description: '**IDE-Mocha**',
      detail: util.mkstats({ stats }),
    })
  }

  showFailureNotification({ stats }) {
    atom.notifications.addError('Test suite failed.', {
      description: '**IDE-Mocha**',
      detail: util.mkstats({ stats }),
      buttons: [{
        text: 'Open Console',
        onDidClick: util.openConsole,
      }],
    })
  }


  // IMPLEMENTATION

  didChangeConfig(change) {
    this.#settings = change.newValue

    // @TODO: Close sockets and create new ones when the interface changes ⚠️
    if (change.newValue.interface !== change.oldValue.interface) {
      atom.notifications.addInfo('Please reload Atom for the interface change to take effect.', {
        description: '**IDE-Mocha**',
      })
    }
  }

  didReceiveConnection(source) {
    const session = new Session({
      root: this.#root,
      linter: this.#linter,
      busy: this.#busy,
      console: this.#console,
    })

    if (this.#settings.openConsoleOnStart) {
      util.openConsole()
    }

    source.on('start', runner => session.didStartRunning({ runner }))
    source.on('end', runner => session.didFinishRunning({ runner }))
    source.on('suite', suite => session.didStartSuite({ suite }))
    source.on('test end', () => session.didFinishTest())
    source.on('pass', test => session.didPassTest({ test }))
    source.on('fail', (test, err) => session.didFailTest({ test, err }))
    source.on('pending', test => session.didSkipTest({ test }))
    source.on('close', () => session.didClose())

    session.once('close', ({ stats }) => {
      if (stats.failures) {
        if (this.#settings.openConsoleOnFailure) {
          util.openConsole()
        }

        if (this.#settings.notifyOnFailure) {
          this.showFailureNotification({ stats })
        }
      }

      if (!stats.failures && this.#settings.notifyOnSuccess) {
        this.showSuccessNotification({ stats })
      }
    })
  }
}

export {
  IdeMocha,
}
