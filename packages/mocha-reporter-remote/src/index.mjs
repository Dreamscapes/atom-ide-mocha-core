// Compatibility file for Mocha (it does not understand ES modules 😥)
const { RemoteReporter } = require('./reporter')

module.exports = RemoteReporter
