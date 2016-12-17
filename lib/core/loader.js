'use strict'

// -------------------------------------------------------------
// Imports.
// -------------------------------------------------------------

const fs = require('fs')
const path = require('path')

const console = require('../helpers/color-console')
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
  var ext = path.extname(filename)

  // TODO: handle markdown files.

  switch (ext) {
    case '.xml':
      return loadLegacyFormat(filename)

    case '.json':
      return loadNewFormat(filename)

    default:
      console.warn('"' + ext + '" files cannot be processed… yet!')
  }
}

/**
 * Load a legacy data file (XML).
 * @param {string} filename
 * @throws
 * @returns {Object}
 */
function loadLegacyFormat (filename) {
  let xml = fs.readFileSync(filename)
  return parser.parseXML(xml)
}

/**
 * Load the new format (JSON).
 * @param {string} filename
 * @throws
 * @returns {Object}
 */
function loadNewFormat (filename) {
  let json = fs.readFileSync(filename)
  return parser.parseJSON(json)
}

// -------------------------------------------------------------
// Exports.
// -------------------------------------------------------------

module.exports = {
  loadDataFile
}
