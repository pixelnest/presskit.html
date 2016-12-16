// Read data files and generates presskit from templates
'use strict'

// -------------------------------------------------------------
// Imports.
// -------------------------------------------------------------

const console = require('./logger')

const fs = require('fs')
const path = require('path')
const parser = require('./parser')
const handlebars = require('handlebars')

const templatesPath = { product: path.join(__dirname, '../assets/project.html'), company: path.join(__dirname, '../assets/index.html') }

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

function generate (dataPath, outputJSONfiles) {
  console.log('') // Newline
  console.log('Looking for data files in ' + dataPath)

  var presskits = {}
  presskits.products = []

  // 1 - get all presskits
  // Inspect given path for data files
  exploreSync(dataPath, function (file) {
    var ext = path.extname(file)
    var filename = path.basename(file, ext)

    if (filename === 'data') {
      loadData(file, function (err, presskit) {
        if (err) console.err(err)
        else {
          console.log('- ' + presskit.type + ': "' + presskit.title + '" (' + file + ')')

          if (presskit.type === 'company') {
            if (presskits.company) console.error('Multiple companies detected. This is not supported yet, only the last will be used!')
            presskits.company = {path: dataPath, presskit: presskit}
          } else {
            presskits.products.push({path: file, presskit: presskit})
          }
        }
      })
    }
  })

  console.log('') // Newline
  console.log('Generating HTML...')

  // 2 - generates all presskits.
  let outputProducts = []
  for (let i = 0, len = presskits.products.length; i < len; i++) {
    let p = presskits.products[i]

    let outputPath = build(dataPath, p.path, p.presskit, [], outputJSONfiles)
    outputProducts.push({path: outputPath, title: p.presskit.title})
  }

  // Company should be the last one, listing all the products
  if (presskits.company) {
    // Get a ref to all products
    build(dataPath, presskits.company.path, presskits.company.presskit, outputProducts, outputJSONfiles)
  }
}

// Find all files in the given folder and raise the callback for each
function exploreSync (dirPath, callback) {
  fs.readdirSync(dirPath).forEach(function (name) {
    var filePath = path.join(dirPath, name)
    var stat = fs.statSync(filePath)
    if (stat.isFile()) {
      callback(filePath, stat)
    } else if (stat.isDirectory()) {
      // Ignore build/
      if (path.basename(filePath) === 'build') {
        console.warn('Ignoring build/ folders (' + filePath + ')')
      } else {
        // Resursivity
        exploreSync(filePath, callback)
      }
    }
  })
}

// Build the HTML for the given data file
function loadData (dataFile, callback) {
  var ext = path.extname(dataFile)

  // Find the right parser
  if (ext === '.xml') {
    // Old presskit() format
    loadDoPresskit(dataFile, callback)
  } else if (ext === '.json') {
    // New presskit.html format
    loadPresskitDotHTML(dataFile, callback)
  } else {
    // TODO .md
    console.warn('"' + ext + '" files cannot be processed... yet!')
  }
}

// Build the HTML for a data.xml (presskit()) file
function loadDoPresskit (dataFile, callback) {
  // Convert data.xml into the new JSON format
  try {
    let xml = fs.readFileSync(dataFile)
    parser.parseXML(xml, callback)
  } catch (e) {
    callback(e)
  }
}

// Build the HTML for a data.json (presskit.html) file
function loadPresskitDotHTML (dataFile, callback) {
  try {
    // Read file
    let json = fs.readFileSync(dataFile)
    parser.parseJSON(json, callback)
  } catch (e) {
    callback(e)
  }
}

// Build the HTML
function build (basePath, dataFile, presskit, relatedProducts, outputJSONfiles) {
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
  var html = template({ presskit: presskit, products: relatedProducts })

  // Export result in HTML
  // -- Ensure ./build exists
  var buildDir = path.join(basePath, 'build')
  createDir(buildDir)

  var targetDir = buildDir

  if (presskit.type !== 'company') {
    // Company should be placed in the root folder
    // but each product is a subfolder, named as the source's folder name
    targetDir = path.join(buildDir, path.basename(path.dirname(dataFile)))
    createDir(targetDir)
  }

  // Prepare output filename
  var htmlFilename = 'index.html'
  var htmlDestination = path.join(targetDir, htmlFilename)

  console.log('- ' + presskit.title + ' ->  ' + htmlDestination)

  // -- Write HTML
  fs.writeFileSync(htmlDestination, html)

  // -- Copy all assets from images/ to build/images/
  var assetsSourceDir = path.join(path.dirname(dataFile), 'images')
  if (fs.existsSync(assetsSourceDir)) {
    var assetsTargetDir = path.join(targetDir, 'images')

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
    fs.writeFileSync(path.join(targetDir, 'data.json'), JSON.stringify(presskit, null, 2))
  }

  // Output relative path from build/
  return path.relative(buildDir, htmlDestination)
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

module.exports = {
  generate
}
