// Read data files and generates presskit from templates
'use strict'

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------
var Generator = function () {
}

Generator.prototype.generate = function (path) {
  console.log('Looking for data files in ' + path)
}

// -------------------------------------------------------------
// Exports.
// -------------------------------------------------------------
module.exports = new Generator()
