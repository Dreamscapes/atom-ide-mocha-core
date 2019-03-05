'use strict'

module.exports = {
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
