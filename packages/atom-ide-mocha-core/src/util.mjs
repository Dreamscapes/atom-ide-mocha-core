import { mkaddress } from '@atom-ide/utils'

const CONSOLE_VIEW_URI = 'atom://nuclide/console'

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

function clearConsole() {
  // ⚠️ Dispatching commands programmatically is discouraged since the command names are not part
  // of a package's public API. However, the Console service does not expose API to clear it. 🤷‍♂️
  return atom.commands.dispatch(
    atom.workspace.getActivePane().element,
    'console:clear',
  )
}

export {
  mkaddress,
  mkcommandinfo,
  mkstats,
  openConsole,
  clearConsole,
}
