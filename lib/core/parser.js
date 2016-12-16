// Parse all kinds of data files
'use strict'

// -------------------------------------------------------------
// Imports.
// -------------------------------------------------------------

var xml2js = require('xml2js')

// Configure XML parser
// -- Avoid arrays for single elements
var xmlParser = new xml2js.Parser({explicitArray: false, async: false})

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

// Convert data.xml content into a JSON string
function parseXML (xml, callback) {
  var presskit

  if (!xml) {
    callback(new Error('XML input was null or empty'), presskit)
    return
  }

  xmlParser.parseString(xml, function (err, result) {
    // FIXME: is there a way to not have an error BUT no result aswell?
    // Check the behavior of xml2js.
    if (err || !result) {
      callback(err, presskit)
      return
    }

    // Values are nested in the "game" or "company"node
    // So we need to detect and ignore this root element
    if (result.game) {
      presskit = result.game
      presskit.type = 'product'
    } else if (result.product) {
      presskit = result.product
      presskit.type = 'product'
    } else if (result.company) {
      presskit = result.company
      presskit.type = 'company'
    } else {
      callback(new Error('Unrecognized XML file, expected <game> or <company> root tag'), presskit)
      return
    }

    callback(null, presskit)
  })
}

// Parse a presskit.html data.json file
function parseJSON (json, callback) {
  if (!json) {
    callback(new Error('JSON input was null or empty'))
    return
  }

  try {
    let presskit = JSON.parse(json)

    // Normalize the type `game` to `product`.
    // Why? `game` is not generic enough, but we want to be compatible with presskit().
    if (presskit.type === 'game') {
      presskit.type = 'product'
    }

    // Valid type?
    if (presskit.type !== 'company' && presskit.type !== 'product') {
      callback(new Error('Unrecognized JSON file, expected "game" or "company" root tag'))
    }

    callback(null, presskit)
  } catch (err) {
    callback(err)
  }
}

// -------------------------------------------------------------
// Exports.
// -------------------------------------------------------------

module.exports = {
  parseXML,
  parseJSON
}
