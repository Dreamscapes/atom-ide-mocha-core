import * as os from 'os'
import * as path from 'path'
import { EventEmitter } from 'events'
import * as StackUtils from 'stack-utils'
import { mkstats, openConsole } from './util'

const stackutils = new StackUtils({
  internals: StackUtils.nodeInternals(),
})

const loglevels = {
  spec: 4,
  suite: 3,
  min: 2,
  silent: 1,
}

class Session extends EventEmitter {
  #root = null
  #linter = null
  #messages = new Map()
  #busy = null
  #spinner = null
  #console = null
  #loglevel = null
  #stats = {
    total: 0,
    completed: 0,
    passes: 0,
    failures: 0,
    pending: 0,
    duration: 0,
  }

  #startedAt = Date.now()
  #isFinished = false

  // eslint-disable-next-line no-shadow
  constructor({ root, linter, busy, console, verbosity }) {
    super()

    this.#root = root
    this.#linter = linter
    this.#busy = busy
    this.#console = console
    this.#loglevel = loglevels[verbosity]
  }

  didStartRunning({ runner }) {
    this.#stats.total = runner.suite.total

    this.#linter.clearMessages()
    this.#spinner = this.#busy.reportBusy(null, {
      onDidClick: openConsole,
    })
    this.reportProgress({ stats: this.#stats })
  }

  didFinishRunning({ runner }) {
    const stats = this.#stats = {
      ...this.#stats,
      ...runner.stats,
      total: runner.suite.total,
    }

    this.#isFinished = true
    this.#loglevel >= loglevels.min && this.#console.log(mkstats({ stats }))
  }

  didClose() {
    // If the session closed abruptly (ie. due to user terminating Mocha before completion)
    // calculate some statistics on our end.
    if (!this.#isFinished) {
      this.#stats.duration = Date.now() - this.#startedAt
    }

    this.#spinner.dispose()
    this.emit('close', { stats: this.#stats })
  }

  didStartSuite({ suite }) {
    // Avoid printing an empty line at the beginning of test run, the root suite does not have a
    // title ☝️
    if (suite.root) {
      return
    }

    this.#loglevel >= loglevels.suite && this.#console.log(suite.titlePath.join(' ▶︎ '))
  }

  didFinishTest() {
    this.#stats.completed++
    this.reportProgress({ stats: this.#stats })
  }

  didPassTest({ test }) {
    this.#stats.passes++
    this.#loglevel >= loglevels.spec && this.#console.success(test.title)
  }

  didFailTest({ test, err }) {
    this.#stats.failures++
    this.#console.error(test.title)
    this.#console.error(err.stack)

    const message = mkdiagmessage({ root: this.#root, test, err })

    // We could not generate a meaningful diagnostic message for this error 😢
    if (!message) {
      return
    }

    const messages = this.#messages.get(message.location.file) || []
    messages.push(message)
    this.#messages.set(message.location.file, messages)
    this.#linter.setMessages(message.location.file, messages)
  }

  didSkipTest({ test }) {
    this.#stats.pending++
    this.#loglevel >= loglevels.spec && this.#console.warn(test.title)
  }

  reportProgress({ stats }) {
    const completed = stats.completed
    const total = stats.total
    const percent = mkpercent(stats)

    this.#spinner.setTitle(`Running Mocha tests: ${completed} / ${total} (${percent}%)`)
  }
}

function mkdiagmessage({ root, test, err }) {
  const callsite = mkcallsite(err)

  // If we have no viable error location do not show the error in diagnostics 🤷‍♂️
  if (!callsite) {
    return null
  }

  // Normalise callsite info with how Linter expects message locations to be defined
  callsite.file = path.resolve(root, callsite.file)
  callsite.line--

  const { file, line, column } = callsite

  return {
    location: {
      file,
      position: [[line, column], [line, column]],
    },
    severity: 'error',
    excerpt: err.message,
    description: `${test.fullTitle}\n\n${err.stack}`,
  }
}

function mkcallsite(err) {
  // Sometimes we could get a weird "error" which is not really an `Error` object and therefore does
  // not have the `.stack` property. Do not attempt to parse such things.
  if (!err.stack) {
    return null
  }

  const traces = stackutils
    .clean(err.stack)
    .trim()
    .split(os.EOL)

  // Attempt to filter out traces pointing to stuff in node_modules
  // Generally the actual cause of an error is either the top-most trace or some trace a few steps
  // below something inside node_modules due to userland code calling into some dependency. If we do
  // not find anything relevant and every trace points to something inside node_modules, well, just
  // use the top-most trace.
  const line = traces
    .filter(trace => !trace.includes('node_modules/'))
    .shift() || traces.shift()

  return stackutils.parseLine(line)
}

function mkpercent(stats) {
  return Math.floor(stats.completed / stats.total * 100)
}

export {
  Session,
}
