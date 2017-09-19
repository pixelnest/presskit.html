'use strict'

const {Parser: XMLParser} = require('xml2js')
const camelCase = require('camelcase')

// -------------------------------------------------------------
// Constants.
// -------------------------------------------------------------

const OPTIONS = {
  explicitArray: false,
  async: false,
  tagNameProcessors: [x => camelCase(x)]
}

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

function parseXML (xml) {
  if (!xml) {
    throw new Error('XML input was null or empty')
  }

  let data

  new XMLParser(OPTIONS).parseString(xml, function (err, result) {
    if (err || !result) {
      throw new Error('Failed to parse XML file')
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

// -------------------------------------------------------------
// Exports.
// -------------------------------------------------------------

module.exports = {
  parseXML
}
