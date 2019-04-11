/**
 * These platform strings are known to support standard Unix sockets
 */
const SOCKET_SUPPORTED_PLATFORMS = [
  'aix',
  'darwin',
  'freebsd',
  'linux',
  'openbsd',
  'sunos',
]

/**
 * Known interface modes
 */
const MODE = {
  UNIX: 'unix',
  TCP: 'IP',
}

const MOCHA_EVENT = {
  START: 'start',
  END: 'end',
  SUITE: 'suite',
  SUITE_END: 'suite end',
  TEST: 'test',
  TEST_END: 'test end',
  HOOK: 'hook',
  HOOK_END: 'hook end',
  PASS: 'pass',
  FAIL: 'fail',
  PENDING: 'pending',
}

export {
  SOCKET_SUPPORTED_PLATFORMS,
  MODE,
  MOCHA_EVENT,
}
