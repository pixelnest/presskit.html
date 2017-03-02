'use strict'

const XMLParser = require('xml2js').Parser

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

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

// -------------------------------------------------------------
// Exports.
// -------------------------------------------------------------

module.exports = {
  parseXML
}
