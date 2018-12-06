import { CompositeDisposable } from 'atom'
import fs from 'fs'
import path from 'path'
import { Consumer } from 'remote-event-emitter'
import * as util from './util'
import { config, menus } from './definitions'
import { Session } from './session'

const HELP_TEMPLATE = fs.readFileSync(path.resolve(__dirname, 'static', 'help.md'), 'utf8')

class IdeMocha {
  config = config
  menus = menus
  commands = {
    'ide-mocha:print-address-info': ::this.doPrintAddressInfo,
    'ide-mocha:copy-receiver-address': ::this.doCopyReceiverAddress,
    'ide-mocha:copy-mocha-command': ::this.doCopyMochaCommand,
    'ide-mocha:help': ::this.doHelp,
  }

  #subscriptions = null
  #busy = null
  #console = null
  #linter = null
  #remotes = null
  #settings = null

  // LIFECYCLE

  activate() {
    this.#remotes = new Map()
    this.#settings = atom.config.get('ide-mocha')
    this.#subscriptions = new CompositeDisposable()
    this.#subscriptions.add(atom.commands.add('atom-workspace', this.commands))
    this.#subscriptions.add(atom.menu.add(this.menus))
    this.#subscriptions.add(atom.config.onDidChange('ide-mocha', ::this.didChangeConfig))
    this.#subscriptions.add(atom.project.onDidChangePaths(::this.didChangePaths))
    // Initial socket setup because the above listener is not triggered at Atom startup
    // Delay socket activation due to Atom sometimes not returning project paths at startup 🤷‍♂️
    setImmediate(() => this.didChangePaths(atom.project.getPaths()))
  }

  async deactivate() {
    // Close all opened remotes
    await this.didChangePaths([])

    this.#subscriptions.dispose()
    this.#subscriptions = null
    this.#busy = null
    this.#console = null
    this.#linter = null
    this.#remotes = new Map()
    this.#settings = null
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
    for (const [folder, { address }] of this.#remotes.entries()) {
      this.#console.log(`${path.basename(folder)}: ${address}`)
    }

    return util.openConsole()
  }

  doCopyReceiverAddress() {
    const primary = atom.project.getPaths().shift()
    const address = this.#remotes.get(primary).address

    atom.clipboard.write(address)
    atom.notifications.addSuccess(`Copied for project folder: ${path.basename(primary)}!`, {
      description: '**IDE-Mocha**',
    })
  }

  doCopyMochaCommand() {
    const primary = atom.project.getPaths().shift()
    const address = this.#remotes.get(primary).address
    const command = util.mkcommandinfo({ address })

    atom.clipboard.write(command)
    atom.notifications.addSuccess(`Copied for project folder: ${path.basename(primary)}!`, {
      description: '**IDE-Mocha**',
    })
  }

  doHelp() {
    const primary = atom.project.getPaths().shift()
    const address = this.#remotes.get(primary).address
    const command = util.mkcommandinfo({ address })

    return this.showHelpNotification({ command })
  }


  // TEST RESULTS NOTIFICATIONS

  showHelpNotification({ command }) {
    const help = HELP_TEMPLATE.replace('#{COMMAND}', command)

    atom.notifications.addInfo('IDE-Mocha: Help', {
      description: help,
      icon: 'mortar-board',
      dismissable: true,
      buttons: [{
        // Extra space to make room between the clippy icon and text 🎨
        text: ' Copy Mocha command',
        className: 'btn btn-info icon-clippy selected',
        onDidClick: ::this.doCopyReceiverAddress,
      }, {
        text: ' Show sockets for all folders',
        className: 'btn btn-info',
        onDidClick: ::this.doPrintAddressInfo,
      }],
    })
  }

  showSuccessNotification({ stats }) {
    atom.notifications.addSuccess('Test suite passed.', {
      description: '**IDE-Mocha**',
      detail: util.mkstats({ stats }),
      buttons: [{
        text: 'Open Console',
        onDidClick: util.openConsole,
      }],
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

  async didChangeConfig(change) {
    this.#settings = change.newValue

    if (change.newValue.interface !== change.oldValue.interface) {
      // Force-close all existing sockets by pretending we have no project folders and start new
      // sockets (with updated configuration) immediately after
      await this.didChangePaths([])
      await this.didChangePaths(atom.project.getPaths())
    }
  }

  async didChangePaths(paths) {
    const removed = Array
      .from(this.#remotes.keys())
      .filter(folder => !paths.includes(folder))

    await Promise.all(removed.map(::this.destroyRemoteForFolder))
    await Promise.all(paths.map(::this.createRemoteForFolder))
  }

  async createRemoteForFolder(folder) {
    // This project folder already has a socket, move on
    if (this.#remotes.has(folder)) {
      return
    }

    const type = this.#settings.interface
    const socket = new Consumer()
    const address = util.mkaddress({ root: folder, type })
    const remote = { address, socket }
    this.#remotes.set(folder, remote)

    // Ensure the socket does not exist before we bind to it. And yes, just ignore any errors
    // thrown here. If the file does not exist it's all good and if we cannot unlink it then well,
    // we can't really do anything anyway and we will instead throw during bind.
    if (typeof address === 'string') {
      await new Promise(resolve => fs.unlink(address, () => resolve()))
    }

    remote.socket.on('connection', source => this.didReceiveConnection({ folder, source }))
    await remote.socket.listen({ address })
  }

  async destroyRemoteForFolder(folder) {
    const remote = this.#remotes.get(folder)

    // Socket already destroyed, move on
    if (!remote) {
      return
    }

    this.#remotes.delete(folder)
    await remote.socket.close()
  }

  didReceiveConnection({ folder, source }) {
    const session = new Session({
      root: folder,
      linter: this.#linter,
      busy: this.#busy,
      console: this.#console,
      verbosity: this.#settings.verbosity,
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
