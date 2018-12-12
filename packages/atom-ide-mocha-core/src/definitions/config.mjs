import * as os from 'os'

const config = {
  interface: {
    title: 'Preferred interface type',
    description: [
      'Preferred communications interface. Unix sockets tend to be generally faster, while IP',
      'allows Atom to receive Mocha reports from anywhere on your local loopback interface (ie.',
      'from inside Docker).<br>',
      'Both options will always produce the same socket/port per project, even when Atom',
      'restarts.<br>',
      '<br>',
      '_Windows users should prefer IP since named pipes may not work correctly with current',
      'implementation._',
    ].join(' '),

    type: 'string',
    enum: [
      'unix',
      'IP',
    ],
    get default() {
      // These platforms support Unix sockets so let's use that by default.
      // win32 will use IP. 💩
      return ['aix', 'darwin', 'freebsd', 'linux', 'openbsd', 'sunos'].includes(os.platform())
        ? 'unix'
        : 'IP'
    },
  },

  verbosity: {
    title: 'Verbosity level',
    description: [
      'Specify how much information you would like to see in the console:<br>',
      '<br>',
      ' • `spec`: show full logs. This looks similar to the built-in _spec_ reporter.<br>',
      ' • `suite`: show only suite titles as they are processed.<br>',
      ' • `min`: show only final test run stats. This looks similar to the built-in _min_',
      'reporter.<br>',
      ' • `silent`: show no output in the console at all.<br>',
      '<br>',
      '_You can always watch the current progress by hovering over the busy spinner._<br>',
      '_Errors are always displayed in the console regardless of this setting._',
    ].join(' '),
    type: 'string',
    enum: [
      'spec',
      'suite',
      'min',
      'silent',
    ],
    default: 'spec',
  },

  notifyOnSuccess: {
    title: 'Notify on successful test run',
    description: 'Show a notification when the test suite finishes successfully.',

    type: 'boolean',
    default: false,
  },

  notifyOnFailure: {
    title: 'Notify on failed test run',
    description: 'Show a notification when the test suite fails.',

    type: 'boolean',
    default: true,
  },

  openConsoleOnStart: {
    title: 'Open Console pane on start',
    description: [
      'When Mocha starts providing progress information the Console pane will',
      'automatically show up.',
    ].join(' '),
    type: 'boolean',
    default: true,
  },

  openConsoleOnFailure: {
    title: 'Open Console pane after failed test run',
    description: [
      'When the test suite encountered test failures, open the Console pane to immediately see the',
      'details.',
    ].join(' '),
    type: 'boolean',
    default: true,
  },
}

export {
  config,
}
