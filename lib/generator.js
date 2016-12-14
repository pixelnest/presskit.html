// Read data files and generates presskit from templates
'use strict'

const fs = require('fs')
const path = require('path')
const converter = require('../lib/converter')
const handlebars = require('handlebars')

const templatesPath = { product: '../assets/project.html', company: '../assets/index.html' }

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------
var Generator = function () {
}

Generator.prototype.generate = function (dataPath) {
  console.log('Looking for data files in ' + dataPath)

  // Inspect given path for data files
  explore(dataPath, function (file) {
    var ext = path.extname(file)
    var filename = path.basename(file, ext)

    if (filename === 'data') {
      generateForData(dataPath, file)
    }
  })
}

// Find all files in the given folder and raise the callback for each
function explore (dirPath, callback) {
  fs.readdirSync(dirPath).forEach(function (name) {
    var filePath = path.join(dirPath, name)
    var stat = fs.statSync(filePath)
    if (stat.isFile()) {
      callback(filePath, stat)
    } else if (stat.isDirectory()) {
      // Resursivity
      explore(filePath, callback)
    }
  })
}

// Build the HTML for the given data file
function generateForData (basePath, dataFile) {
  var ext = path.extname(dataFile)

  // Find the right parser
  if (ext === '.xml') {
    // Old presskit() format
    generateDoPresskit(basePath, dataFile)
  } else {
    // TODO .json .md
    console.warn(ext + ' files cannot be processed... yet!')
  }
}

// Build the HTML for a data.xml (presskit()) file
function generateDoPresskit (basePath, dataFile) {
  // Convert data.xml into the nex JSON format
  // -- Read file
  fs.readFile(dataFile, function (err, xml) {
    if (err) console.error(err)
    else {
      // -- Call converter
      converter.convert(xml, function (err, presskit) {
        if (err) console.error(err)
        else {
          // Generate template
          build(basePath, dataFile, presskit)
        }
      })
    }
  })
}

// Build the HTML
function build (basePath, dataFile, presskit) {
  // Get template
  var templatePath
  if (presskit.type === 'product') {
    templatePath = templatesPath.product
  } else if (presskit.type === 'company') {
    templatePath = templatesPath.company
  }

  var t = fs.readFileSync(templatePath, 'utf-8')
  var template = handlebars.compile(t)

  // Call Handlebars
  var html = template({ presskit: presskit })

  // Export result in HTML
  // -- Ensure ./build exists
  var buildDir = path.join(basePath, 'build')

  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir)
  }

// Prepare output filename
  var dataFilename = path.basename(path.dirname(dataFile))
  var htmlFilename = (presskit.type === 'company' ? 'index' : dataFilename) + '.html'
  var htmlDestination = path.join(buildDir, htmlFilename)

  console.log('Generating: ' + dataFile + ' ->  ' + htmlDestination)

    // -- Write HTML
  fs.writeFileSync(htmlDestination, html)
}

// -------------------------------------------------------------
// Exports.
// -------------------------------------------------------------
module.exports = new Generator()
