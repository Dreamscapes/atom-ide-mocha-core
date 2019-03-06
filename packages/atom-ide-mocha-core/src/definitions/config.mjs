import { mkdefaultmode, constants } from '@atom-ide/utils'

const { MODE } = constants
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
          MODE.UNIX,
          MODE.TCP,
        ],
        default: mkdefaultmode(),
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

      durations: {
        title: 'Show test durations in the console',
        description: [
          'When enabled, all test cases will have their test duration shown after their titles in',
          'the console.',
        ].join(' '),
        type: 'boolean',
        default: true,
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
