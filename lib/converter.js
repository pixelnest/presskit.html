// Convert presskit() data.xml file into the new JSON format
'use strict'
var fs = require('fs')
var xmlParser = require('xml2js').parseString

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------
var Converter = function () {}

// Convert data.xml content into a JSON string
Converter.prototype.convert = function (xml, callback) {
  var json

  if (!xml) callback(new Error('XML input was null or empty'), json)

  xmlParser(xml, function (err, result) {
    if (!err && result) {
      json = JSON.stringify(result, null, 2)
    }
    callback(err, json)
  })
}

// Convert an XML data file to a formatted JSON file
Converter.prototype.convertFile = function (source, destination, callback) {
  fs.readFile(source, function (err, data) {
    Converter.convert(data, function (error, result) {
      if (!error) {
        fs.writeFile(destination, data, function (err) {
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
