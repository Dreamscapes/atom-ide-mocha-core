import Mocha from 'mocha'
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
   */
  constructor(runner, { reporterOptions: options }) {
    super(runner)

    this.#runner = runner
    // Initialise the remote event emitter provider
    this.#provider = new Provider({ destination: options.address })

    // Bind Mocha events to functions defined on this class
    RemoteReporter.events.forEach(event => {
      runner.on(event, ::this[event])
    })
  }

  relay(event, ...args) {
    this.#provider.emit(event, ...args)
  }

  start() {
    this.relay('start', serialisers.runner(this.#runner))
  }

  end() {
    this.relay('end', serialisers.runner(this.#runner))
    // Print the final test results to the console, just in case
    this.epilogue()
    // Explicitly close the remote so that Node does not hang indefinitely
    this.#provider.end()
    this.#runner = null
    this.#provider = null
  }

  suite(suite) {
    this.relay('suite', serialisers.suite(suite))
  }

  'suite end'(suite) {
    this.relay('suite end', serialisers.suite(suite))
  }

  test(test) {
    this.relay('test', serialisers.runnable(test))
  }

  'test end'(test) {
    this.relay('test end', serialisers.runnable(test))
  }

  hook(hook) {
    this.relay('hook', serialisers.runnable(hook))
  }

  'hook end'(hook) {
    this.relay('hook end', serialisers.runnable(hook))
  }

  pass(test) {
    this.relay('pass', serialisers.runnable(test))
  }

  fail(test, err) {
    this.relay('fail', serialisers.runnable(test), serialisers.err(err))
  }

  pending(test) {
    this.relay('pending', serialisers.runnable(test))
  }
}

export {
  RemoteReporter,
}
