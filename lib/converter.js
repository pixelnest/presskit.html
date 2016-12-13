// Convert presskit() data.xml file into the new JSON format
'use strict'
var fs = require('fs')
var xml2js = require('xml2js')

// Configure parser
// -- Avoid arrays for single elements
var xmlParser = new xml2js.Parser({explicitArray: false})

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------
var Converter = function () {
}

// Convert data.xml content into a JSON string
Converter.prototype.convert = function (xml, callback) {
  var presskit

  if (!xml) callback(new Error('XML input was null or empty'), presskit)

  xmlParser.parseString(xml, function (err, result) {
    if (!err && result) {
      // Values are nested in the "game" node
      if (result.game) {
        presskit = result.game
      }
    }
    callback(err, presskit)
  })
}

// Convert an XML data file to a formatted JSON file
Converter.prototype.convertFile = function (source, destination, format, callback) {
  fs.readFile(source, function (err, data) {
    Converter.convert(data, function (error, result) {
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
module.exports = new Converter()
