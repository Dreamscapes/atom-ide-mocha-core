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

export {
  SOCKET_SUPPORTED_PLATFORMS,
  MODE,
}
