import * as Mocha from 'mocha'
import { Provider } from 'remote-event-emitter'
import { mkaddress, constants } from '@atom-ide/utils'
import serialisers from './serialisers'

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
  constructor(runner, { reporterOptions: options }) {
    super(runner)

    this.#runner = runner
    this.#options = options

    if (this.#options.root) {
      this.#options.address = mkaddress({
        root: this.#options.root,
        mode: this.#options.mode || constants.MODE.UNIX,
      })
    }

    // Initialise the remote event emitter provider
    this.#provider = new Provider({ destination: options.address })

    // Bind Mocha events to functions defined on this class
    Object.values(constants.MOCHA_EVENT).forEach(event => {
      runner.on(event, ::this[event])
    })

    // If the provider fails for some reason, show the error in the console
    this.#provider.on('error', ::this.onError)
  }

  onError(err) {
    // eslint-disable-next-line no-console
    console.error(err)
    throw err
  }


  start() {
    this.#provider.emit(constants.MOCHA_EVENT.START, serialisers.runner(this.#runner))
  }

  end() {
    this.#provider.emit(constants.MOCHA_EVENT.END, serialisers.runner(this.#runner))

    // Print the final test results to the console, just in case
    if (!this.#options.nostats) {
      this.epilogue()
    }

    // Explicitly close the remote so that Node does not hang indefinitely
    this.#provider.end()
    this.#runner = null
    this.#provider = null
  }

  suite(suite) {
    this.#provider.emit(constants.MOCHA_EVENT.SUITE, serialisers.suite(suite))
  }

  'suite end'(suite) {
    this.#provider.emit(constants.MOCHA_EVENT.SUITE_END, serialisers.suite(suite))
  }

  test(test) {
    this.#provider.emit(constants.MOCHA_EVENT.TEST, serialisers.runnable(test))
  }

  'test end'(test) {
    this.#provider.emit(constants.MOCHA_EVENT.TEST_END, serialisers.runnable(test))
  }

  hook(hook) {
    this.#provider.emit(constants.MOCHA_EVENT.HOOK, serialisers.runnable(hook))
  }

  'hook end'(hook) {
    this.#provider.emit(constants.MOCHA_EVENT.HOOK_END, serialisers.runnable(hook))
  }

  pass(test) {
    this.#provider.emit(constants.MOCHA_EVENT.PASS, serialisers.runnable(test))
  }

  fail(test, err) {
    this.#provider.emit(
      constants.MOCHA_EVENT.FAIL,
      serialisers.runnable(test),
      serialisers.err(err),
    )
  }

  pending(test) {
    this.#provider.emit(constants.MOCHA_EVENT.PENDING, serialisers.runnable(test))
  }
}

export {
  RemoteReporter,
}
