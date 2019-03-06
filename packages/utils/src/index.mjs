import * as os from 'os'
import * as path from 'path'
import * as hashToPort from 'hash-to-port'
import * as constants from './constants'

const { SOCKET_SUPPORTED_PLATFORMS, MODE } = constants

/**
 * Create a socket address or port in a deterministic way for a given absolute directory path
 *
 * @param     {Object}    options           Function options
 * @param     {String}    options.root      Absolute path to the directory
 * @param     {String}    options.mode      Interface mode. Either `unix` or `ip`.
 * @return    {String}                      A full path to the socket
 */
function mkaddress({ root, mode }) {
  const name = path.basename(root)

  if (!mode) {
    mode = mkdefaultmode()
  }

  switch (mode) {
    case MODE.UNIX:
    case MODE.UNIX.toLowerCase():
      return path.resolve(os.tmpdir(), `mocha-${name}.sock`)

    case MODE.TCP:
    case MODE.TCP.toLowerCase():
      return hashToPort(name)

    default:
      throw new Error(`Unknown address interface mode: ${mode}`)
  }
}

/**
 * Determine the best network interface mode for the current platform
 *
 * @return    {String}    Either 'unix' or 'IP'
 */
function mkdefaultmode() {
  return SOCKET_SUPPORTED_PLATFORMS.includes(os.platform())
    ? MODE.UNIX
    : MODE.TCP
}

export {
  mkaddress,
  mkdefaultmode,
  constants,
}
