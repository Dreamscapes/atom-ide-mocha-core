import net from 'net'
import crypto from 'crypto'
import Mocha from 'mocha'
import { JSONTransform } from './json-transform'
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
   * Random execution ID
   *
   * Useful to differentiate messages on the receiving end - each ID will belong to a single
   * instance of this reporter.
   *
   * @private
   * @type    {String}
   */
  #id = crypto.randomBytes(3).toString('base64')

  /**
   * An instance of Mocha's Test Runner
   *
   * @private
   * @type    {Object}
   */
  #runner = null

  /**
   * The net server to send the data to
   * Actually this is our initial JSON transform stream but we pipe that to the server later
   *
   * @private
   * @type    {JSONTransform}
   */
  #remote = new JSONTransform()

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

    this.#remote.pipe(net.connect(options.address))
    this.#runner = runner

    RemoteReporter.events.forEach(event => {
      runner.on(event, ::this[event])
    })
  }

  relay(event, ...args) {
    const id = this.#id

    this.#remote.write({ id, event, args })
  }

  start() {
    this.relay('start', serialisers.runner(this.#runner))
  }

  end() {
    this.relay('end', serialisers.runner(this.#runner))
    // Print the final test results to the console, just in case
    this.epilogue()
    // Explicitly close the remote so that Node does not hang indefinitely
    this.#remote.end()
    this.#runner = null
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
