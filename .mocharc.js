'use strict'

module.exports = {
  reporterOption: [
    `root=${__dirname}`,
    'nostats=1',
  ],
  colors: true,
  checkLeaks: true,
  require: [
    'source-map-support/register',
  ],
  exclude: [
    '**/node_modules/**'
  ],
  spec: ["**/*.test.js"]
}
