import * as os from 'os'

// These platforms support Unix sockets so let's use that by default.
// win32 will use IP. 💩
const socketCapablePlatforms = ['aix', 'darwin', 'freebsd', 'linux', 'openbsd', 'sunos']
const defaultInterface = socketCapablePlatforms.includes(os.platform())
  ? 'unix'
  : 'IP'

const config = {
  general: {
    order: 1,
    type: 'object',
    properties: {
      interface: {
        title: 'Preferred interface type',
        description: [
          'Preferred communications interface. Unix sockets tend to be generally faster, while IP',
          'allows Atom to receive Mocha reports from anywhere on your local loopback interface',
          '(ie. from inside Docker).<br>',
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
        default: defaultInterface,
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
    },
  },

  notifications: {
    order: 2,
    type: 'object',
    properties: {
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
    },
  },

  console: {
    order: 3,
    type: 'object',
    properties: {
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
          'When the test suite encounters failures, open the Console pane to immediately see the',
          'details.',
        ].join(' '),
        type: 'boolean',
        default: true,
      },

      clearConsoleOnStart: {
        title: 'Clear Console pane on start',
        description: [
          'When Mocha starts providing progress information the Console will be cleared of all',
          'existing messages from all providers. This is equivalent of running the',
          '`Console: Clear` command manually.',
        ].join(' '),
        type: 'boolean',
        default: false,
      },
    },
  },
}

export {
  config,
}
