'use strict'

const chalk = require('chalk')

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

function colorize (colorizer, args) {
  return Array.from(args).map(el => colorizer(el))
}

function error () {
  console.error.apply(null, colorize(chalk.red, arguments))
}

function warn () {
  console.warn.apply(null, colorize(chalk.yellow, arguments))
}

// -------------------------------------------------------------
// Exports.
// -------------------------------------------------------------

module.exports = {
  error,
  warn,
  log: console.log
}
