import * as Mocha from 'mocha'
import { Provider } from 'remote-event-emitter'
import serialisers from './serialisers'

/**
 * Mocha reporter which relays all Mocha's events to a TCP or Unix socket
 */
class RemoteReporter extends Mocha.reporters.Base {
  /**
   * List of Mocha events to forward
   * @type    {Array}
   */
  static events = [
    'start',
    'end',
    'suite',
    'suite end',
    'test',
    'test end',
    'hook',
    'hook end',
    'pass',
    'fail',
    'pending',
  ]

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
   * @param   {Boolean}   opts.reporterOptions.nostats  If set to a truthy value, the reporter will
   *                                                    not print the final suite stats to stdout
   */
  constructor(runner, { reporterOptions: options }) {
    super(runner)

    this.#runner = runner
    this.#options = options
    // Initialise the remote event emitter provider
    this.#provider = new Provider({ destination: options.address })

    // Bind Mocha events to functions defined on this class
    RemoteReporter.events.forEach(event => {
      runner.on(event, ::this[event])
    })
  }

  start() {
    this.#provider.emit('start', serialisers.runner(this.#runner))
  }

  end() {
    this.#provider.emit('end', serialisers.runner(this.#runner))

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
    this.#provider.emit('suite', serialisers.suite(suite))
  }

  'suite end'(suite) {
    this.#provider.emit('suite end', serialisers.suite(suite))
  }

  test(test) {
    this.#provider.emit('test', serialisers.runnable(test))
  }

  'test end'(test) {
    this.#provider.emit('test end', serialisers.runnable(test))
  }

  hook(hook) {
    this.#provider.emit('hook', serialisers.runnable(hook))
  }

  'hook end'(hook) {
    this.#provider.emit('hook end', serialisers.runnable(hook))
  }

  pass(test) {
    this.#provider.emit('pass', serialisers.runnable(test))
  }

  fail(test, err) {
    this.#provider.emit('fail', serialisers.runnable(test), serialisers.err(err))
  }

  pending(test) {
    this.#provider.emit('pending', serialisers.runnable(test))
  }
}

export {
  RemoteReporter,
}
