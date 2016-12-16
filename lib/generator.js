// Read data files and generates presskit from templates
'use strict'

const fs = require('fs')
const path = require('path')
const parser = require('../lib/parser')
const handlebars = require('handlebars')

const templatesPath = { product: path.join(__dirname, '../assets/project.html'), company: path.join(__dirname, '../assets/index.html') }

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------
var Generator = function () {
}

Generator.prototype.generate = function (dataPath, outputJSONfiles) {
  console.log('Looking for data files in ' + dataPath)

  // Inspect given path for data files
  explore(dataPath, function (file) {
    var ext = path.extname(file)
    var filename = path.basename(file, ext)

    if (filename === 'data') {
      generateForData(dataPath, file, outputJSONfiles)
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
function generateForData (basePath, dataFile, outputJSONfiles) {
  var ext = path.extname(dataFile)

  // Find the right parser
  if (ext === '.xml') {
    // Old presskit() format
    generateDoPresskit(basePath, dataFile, outputJSONfiles)
  } else if (ext === '.json') {
    // New presskit.html format
    generatePresskitDotHTML(basePath, dataFile, outputJSONfiles)
  } else {
    // TODO .md
    console.warn(ext + ' files cannot be processed... yet!')
  }
}

// Build the HTML for a data.xml (presskit()) file
function generateDoPresskit (basePath, dataFile, outputJSONfiles) {
  // Convert data.xml into the new JSON format
  // -- Read file
  fs.readFile(dataFile, function (err, xml) {
    if (err) console.error(err)
    else {
      // -- Call parser
      parser.parseXML(xml, function (err, presskit) {
        if (err) console.error(err)
        else {
          // Generate template
          build(basePath, dataFile, presskit, outputJSONfiles)
        }
      })
    }
  })
}

// Build the HTML for a data.json (presskit.html) file
function generatePresskitDotHTML (basePath, dataFile, outputJSONfiles) {
  // Read file
  console.log(dataFile)
  fs.readFile(dataFile, function (err, json) {
    if (err) console.error(err)
    else {
      parser.parseJSON(json, function (err, presskit) {
        if (err) console.error(err)
        else {
          // Generate template
          build(basePath, dataFile, presskit, outputJSONfiles)
        }
      })
    }
  })
}

// Build the HTML
function build (basePath, dataFile, presskit, outputJSONfiles) {
  // Get template
  var templatePath
  if (presskit.type === 'product') {
    templatePath = templatesPath.product
  } else if (presskit.type === 'company') {
    templatePath = templatesPath.company
  }

  if (!templatePath) {
    console.error('Missing template! Make sure your presskit has a "type" field (product/company)')
    return
  }

  var t = fs.readFileSync(templatePath, 'utf-8')
  var template = handlebars.compile(t)

  // Call Handlebars
  var html = template({ presskit: presskit })

  // Export result in HTML
  // -- Ensure ./build exists
  var buildDir = path.join(basePath, 'build')
  createDir(buildDir)

  if (presskit.type !== 'company') {
    // Company should be placed in the root folder
    // but each product is a subfolder, named as the source's folder name
    buildDir = path.join(buildDir, path.basename(path.dirname(dataFile)))
    createDir(buildDir)
  }

  // Prepare output filename
  var htmlFilename = 'index.html'
  var htmlDestination = path.join(buildDir, htmlFilename)

  console.log('Generating: ' + dataFile + ' ->  ' + htmlDestination)

    // -- Write HTML
  fs.writeFileSync(htmlDestination, html)

  // -- Copy all assets from images/ to build/images/
  var assetsSourceDir = path.join(path.dirname(dataFile), 'images')
  if (fs.existsSync(assetsSourceDir)) {
    var assetsTargetDir = path.join(buildDir, 'images')

    // Create target dir if necessary
    createDir(assetsTargetDir)

    // Copy all assets from source to target
    fs.readdirSync(assetsSourceDir).forEach(function (name) {
      var source = path.join(assetsSourceDir, name)
      var target = path.join(assetsTargetDir, name)
      fs.writeFileSync(target, fs.readFileSync(source))
    })
  }

  // -- Output data.json?
  if (outputJSONfiles) {
    fs.writeFileSync(path.join(buildDir, 'data.json'), JSON.stringify(presskit, null, 2))
  }
}

// Create dir if it doesn't exists
function createDir (dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
}

// -------------------------------------------------------------
// Exports.
// -------------------------------------------------------------
module.exports = new Generator()
