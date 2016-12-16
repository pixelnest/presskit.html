// Parse all kinds of data files
'use strict'
var fs = require('fs')
var xml2js = require('xml2js')

// Configure XML parser
// -- Avoid arrays for single elements
var xmlParser = new xml2js.Parser({explicitArray: false})

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
    if (!err && result) {
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
    }
    callback(err, presskit)
  })
}

// Convert an XML data file to a formatted JSON file
function convertXMLFile (source, destination, format, callback) {
  fs.readFile(source, function (err, data) {
    parseXML(data, function (error, result) {
      if (!error) {
        var json = JSON.stringify(result.game, null, (format ? 2 : 0))
        fs.writeFile(destination, json, function (err) {
          callback(err)
        })
      } else {
        callback(err)
      }
    })
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
  convertXMLFile,
  parseJSON
}
