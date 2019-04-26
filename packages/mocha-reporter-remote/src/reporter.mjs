import * as Mocha from 'mocha'
import { Provider } from 'remote-event-emitter'
import { mkaddress, mkdefaultmode, constants } from '@atom-ide/utils'
import serialisers from './serialisers'

const { MOCHA_EVENT } = constants

/**
 * Mocha reporter which relays all Mocha's events to a TCP or Unix socket
 */
class RemoteReporter extends Mocha.reporters.Base {
  /**
   * Reporter options, as provided by the user
   *
   * @private
   * @type    {Object}
   */
  #options = null

  /**
   * An instance of Mocha's Test Runner
   *
   * @private
   * @type    {Object}
   */
  #runner = null

  /**
   * An event emitter capable of forwarding emitted events to a remote destination
   *
   * @private
   * @type    {Provider}
   */
  #provider = null

  /**
   * Construct a new reporeter
   *
   * @param   {Object}    runner                        Instance of Mocha's Test Runner
   * @param   {Object}    opts                          Options object
   * @param   {Object}    opts.reporterOptions          Reporter options, as provided by Mocha
   * @param   {String}    opts.reporterOptions.address  Address to send the events to
   * @param   {String}    opts.reporterOptions.root     Root directory of the project
   * @param   {String}    opts.reporterOptions.mode     Networking mode. either `unix` or `ip`.
   * @param   {Boolean}   opts.reporterOptions.nostats  If set to a truthy value, the reporter will
   *                                                    not print the final suite stats to stdout
   */
  constructor(runner, { reporterOptions: options } = {}) {
    super(runner)

    this.#runner = runner
    this.#options = options

    // Ensure we have a valid mode for the current platform
    this.#options.mode = this.#options.mode || mkdefaultmode()

    // If the user did not provide neither root nor the socket address, assume we are running Mocha
    // for a project at path in the current working directory. This should cover 95% of use cases
    // and allows for a truly configuration-less setup. 🚀
    if (!this.#options.root && !this.#options.address) {
      this.#options.root = process.cwd()
    }

    // Note that even if the user provided an address, specifying root will override it. ⚠️
    if (this.#options.root) {
      this.#options.address = mkaddress({
        root: this.#options.root,
        mode: this.#options.mode,
      })
    }

    // Initialise the remote event emitter provider
    this.#provider = new Provider({ destination: this.#options.address })

    // Bind Mocha events to functions defined on this class
    Object.values(MOCHA_EVENT).forEach(event => {
      this.#runner.on(event, ::this[event])
    })

    // If the provider fails for some reason, show the error in the console
    this.#provider.on('error', ::this.onError)
  }

  onError(err) {
    // eslint-disable-next-line no-console
    console.error(err)
    throw err
  }


  [MOCHA_EVENT.START]() {
    this.#provider.emit(MOCHA_EVENT.START, serialisers.runner(this.#runner))
  }

  [MOCHA_EVENT.END]() {
    this.#provider.emit(MOCHA_EVENT.END, serialisers.runner(this.#runner))

    // Print the final test results to the console, just in case
    if (!this.#options.nostats) {
      this.epilogue()
    }

    // Explicitly close the remote so that Node does not hang indefinitely
    this.#provider.end()
    this.#runner = null
    this.#provider = null
  }

  [MOCHA_EVENT.SUITE](suite) {
    this.#provider.emit(MOCHA_EVENT.SUITE, serialisers.suite(suite))
  }

  [MOCHA_EVENT.SUITE_END](suite) {
    this.#provider.emit(MOCHA_EVENT.SUITE_END, serialisers.suite(suite))
  }

  [MOCHA_EVENT.TEST](test) {
    this.#provider.emit(MOCHA_EVENT.TEST, serialisers.runnable(test))
  }

  [MOCHA_EVENT.TEST_END](test) {
    this.#provider.emit(MOCHA_EVENT.TEST_END, serialisers.runnable(test))
  }

  [MOCHA_EVENT.HOOK](hook) {
    this.#provider.emit(MOCHA_EVENT.HOOK, serialisers.runnable(hook))
  }

  [MOCHA_EVENT.HOOK_END](hook) {
    this.#provider.emit(MOCHA_EVENT.HOOK_END, serialisers.runnable(hook))
  }

  [MOCHA_EVENT.PASS](test) {
    this.#provider.emit(MOCHA_EVENT.PASS, serialisers.runnable(test))
  }

  [MOCHA_EVENT.FAIL](test, err) {
    this.#provider.emit(MOCHA_EVENT.FAIL, serialisers.runnable(test), serialisers.err(err))
  }

  [MOCHA_EVENT.PENDING](test) {
    this.#provider.emit(MOCHA_EVENT.PENDING, serialisers.runnable(test))
  }
}

export {
  RemoteReporter,
}
