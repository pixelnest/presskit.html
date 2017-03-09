'use strict'

const fs = require('fs')
const path = require('path')

const console = require('./helpers/color-console')
const generator = require('./core/generator')
const config = require('./config')

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

function start (launchOptions) {
  config.setLaunchOptions(launchOptions)

  parseEntryPoint(launchOptions.entryPoint, (err, entry) => {
    if (err) {
      console.warn('No valid entry point provided. Use current directory instead')
      console.log('')

      generator.generate(process.cwd())
      return
    }

    generator.generate(entry)
  })
}

function parseEntryPoint (entry, cb) {
  // No file provided? Just return the current working dir.
  if (!entry) {
    return cb(null, process.cwd())
  }

  // Check if the entry is valid.
  // And ensure that we use a directory.
  fs.stat(entry, (err, stat) => {
    if (err) {
      return cb(new Error('Not a file'))
    }

    if (stat.isDirectory()) {
      cb(null, entry)
    } else if (stat.isFile()) {
      cb(null, path.dirname(entry))
    } else {
      cb(new Error('Not a directory or file'))
    }
  })
}

// -------------------------------------------------------------
// Exports.
// -------------------------------------------------------------

module.exports = {
  start
}
