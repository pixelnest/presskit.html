'use strict'

const fs = require('fs')
const parser = require('./parser')

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

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
