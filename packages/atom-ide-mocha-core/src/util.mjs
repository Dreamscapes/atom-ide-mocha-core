import os from 'os'
import path from 'path'
import hashToPort from 'hash-to-port'

const CONSOLE_VIEW_URI = 'atom://nuclide/console'

function mkaddress({ root, type = 'unix' }) {
  const name = path.basename(root)

  switch (type) {
    case 'unix':
      return path.resolve(os.tmpdir(), `ide-mocha-${name}.sock`)
    case 'IP':
      return hashToPort(name)
    default:
      throw new Error(`Unknown address interface type: ${type}`)
  }
}

function mkcommandinfo({ address }) {
  return [
    'npx mocha',
    '--reporter mocha-reporter-remote',
    `--reporter-options address=${address}`,
  ].join(' ')
}

function mkstats({ stats }) {
  return [
    `Passing: ${stats.passes}`,
    `Failing: ${stats.failures}`,
    `Pending: ${stats.pending}`,
    `Duration: ${stats.duration} ms`,
  ].join('\n')
}

function openConsole() {
  return atom.workspace.open(CONSOLE_VIEW_URI, { searchAllPanes: true })
}

export {
  mkaddress,
  mkcommandinfo,
  mkstats,
  openConsole,
}
