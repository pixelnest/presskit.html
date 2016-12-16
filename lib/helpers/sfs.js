'use strict'

// -------------------------------------------------------------
// Imports.
// -------------------------------------------------------------

const fs = require('fs')

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

/**
 * Create a directory if it doesn't exist yet.
 * @param {string} dir - The path of the directory to create.
 * @returns {boolean} - true if a directory has been created, false otherwise.
 */
function createDir (dir) {
  if (fs.existsSync(dir)) {
    return false
  }

  fs.mkdirSync(dir)
  return true
}

// -------------------------------------------------------------
// Exports.
// -------------------------------------------------------------

module.exports = {
  createDir
}
