'use strict'

const fs = require('fs')
const parser = require('./parser')

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

/**
 * Convert a data file to its actual data.
 * @param {string} filename
 * @throws
 * @returns {Object}
 */
function loadDataFile (filename) {
  let xml = fs.readFileSync(filename)
  return parser.parseXML(xml)
}

// -------------------------------------------------------------
// Exports.
// -------------------------------------------------------------

module.exports = {
  loadDataFile
}
