const config = {
  interface: {
    title: 'Preferred interface type',
    description: [
      'Preferred communications interface. Unix sockets tend to be generally faster, while IP',
      'allows Atom to receive Mocha reports from anywhere on your local loopback interface (ie.',
      'from inside Docker).<br />Both options will always produce the same socket/port per ',
      'project, even when Atom restarts.',
    ].join(' '),

    type: 'string',
    enum: [
      'unix',
      'IP',
    ],
    default: 'unix',
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
