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
var Parser = function () {
}

// Convert data.xml content into a JSON string
Parser.prototype.convert = function (xml, callback) {
  var presskit

  if (!xml) callback(new Error('XML input was null or empty'), presskit)

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
        console.error('Unrecognized XML file, expcted <game> or <company> root tag')
      }
    }
    callback(err, presskit)
  })
}

// Convert an XML data file to a formatted JSON file
Parser.prototype.convertFile = function (source, destination, format, callback) {
  fs.readFile(source, function (err, data) {
    Parser.convert(data, function (error, result) {
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

// -------------------------------------------------------------
// Exports.
// -------------------------------------------------------------
module.exports = new Parser()
