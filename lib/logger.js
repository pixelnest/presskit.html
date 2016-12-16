'use strict'

// -------------------------------------------------------------
// Imports.
// -------------------------------------------------------------

const chalk = require('chalk')

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

function error () {
  var data = Array.from(arguments).map(a => chalk.red(a))
  console.error.apply(null, data)
}

function warn () {
  var data = Array.from(arguments).map(a => chalk.yellow(a))
  console.warn.apply(null, data)
}

// -------------------------------------------------------------
// Exports.
// -------------------------------------------------------------

module.exports = {
  error,
  warn,
  log: console.log
}
