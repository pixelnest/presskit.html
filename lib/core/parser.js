'use strict'

// -------------------------------------------------------------
// Imports.
// -------------------------------------------------------------

const XMLParser = require('xml2js').Parser

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

/**
 * Parse an XML data file.
 * @param {string} xml
 * @throws
 * @returns {Object}
 */
function parseXML (xml) {
  if (!xml) {
    throw new Error('XML input was null or empty')
  }

  let data

  new XMLParser({ explicitArray: false, async: false }).parseString(xml, function (err, result) {
    // FIXME: is there a way to not have an error BUT no result aswell?
    // Check the behavior of xml2js.
    if (err || !result) {
      throw err
    }

    // Values are nested in the "product", "game" or "company" root node.
    // We need to detect and ignore this root element.
    if (result.game) {
      data = result.game
      data.type = 'product'
    } else if (result.product) {
      data = result.product
      data.type = 'product'
    } else if (result.company) {
      data = result.company
      data.type = 'company'
    } else {
      throw new Error('Unrecognized XML file, expected <game> or <company> root tag')
    }
  })

  return data
}

//
/**
 * Parse a JSON data file.
 * @param {string} json
 * @throws
 * @returns {Object}
 */
function parseJSON (json) {
  if (!json) {
    throw new Error('JSON input was null or empty')
  }

  let data = JSON.parse(json)

  // Normalize the type `game` to `product`.
  // Why? `game` is not generic enough, but we want to be compatible with data().
  if (data.type === 'game') {
    data.type = 'product'
  }

  // Valid type?
  if (data.type !== 'company' && data.type !== 'product') {
    throw new Error('Unrecognized JSON file, expected "game" or "company" root tag')
  }

  return data
}

// -------------------------------------------------------------
// Exports.
// -------------------------------------------------------------

module.exports = {
  parseXML,
  parseJSON
}
