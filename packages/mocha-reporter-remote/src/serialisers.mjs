export default {
  // https://github.com/mochajs/mocha/blob/master/lib/runner.js
  runner(runner) {
    return {
      suite: this.suite(runner.suite),
      stats: runner.stats,
      total: runner.total,
      failures: runner.failures,
      started: runner.started,
    }
  },

  // https://github.com/mochajs/mocha/blob/master/lib/suite.js
  suite(suite) {
    return {
      root: suite.root,
      fullTitle: suite.fullTitle(),
      titlePath: suite.titlePath(),
      total: suite.total(),
      parent: suite.parent
        ? this.suite(suite.parent)
        : null,
    }
  },

  // https://github.com/mochajs/mocha/blob/master/lib/runnable.js
  runnable(runnable) {
    return {
      title: runnable.title,
      async: runnable.async,
      sync: runnable.sync,
      timedOut: runnable.timedOut,
      pending: runnable.pending,
      type: runnable.type,
      file: runnable.file,
      fullTitle: runnable.fullTitle(),
      titlePath: runnable.titlePath(),
      isPassed: runnable.isPassed(),
      isFailed: runnable.isFailed(),
      isPending: runnable.isPending(),
      retries: runnable.retries(),
      currentRetry: runnable.currentRetry(),
      parent: this.suite(runnable.parent),
    }
  },

  // Standard error formatter
  // Unfortunately this won't serialise additional and potentially more useful properties like
  // detailed validation errors etc. 😥
  // Pull requests improving this are much welcome!
  err(err) {
    return {
      name: err.name,
      message: err.message,
      stack: err.stack,
    }
  },
}
