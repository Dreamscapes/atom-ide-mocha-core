const menus = [{
  label: 'Packages',
  submenu: [{
    label: 'IDE-Mocha',
    submenu: [{
      label: 'Help',
      command: 'ide-mocha:help',
    }, {
      label: 'Print Address Info',
      command: 'ide-mocha:print-address-info',
    }, {
      label: 'Copy Receiver Address',
      command: 'ide-mocha:copy-receiver-address',
    }, {
      label: 'Copy Mocha Command',
      command: 'ide-mocha:copy-mocha-command',
    }],
  }],
}]

export {
  menus,
}
