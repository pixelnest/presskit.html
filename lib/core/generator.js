// Read data files and generates presskit from templates
'use strict'

// -------------------------------------------------------------
// Imports.
// -------------------------------------------------------------

const fs = require('fs')
const path = require('path')

const handlebars = require('handlebars')

const console = require('../helpers/color-console')
const sfs = require('../helpers/sfs')

const loader = require('./loader')

const templatesPath = {
  company: path.join(__dirname, '../../assets/company.html'),
  product: path.join(__dirname, '../../assets/product.html')
}

const assetsToCopy = [
  path.join(__dirname, '../../assets/css/master.css'),
  path.join(__dirname, '../../assets/css/normalize.css')
]

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

function isDataFile (filename) {
  filename = path.basename(filename, path.extname(filename))

  return filename === 'data'
}

function generate (dataPath, outputJSONfiles) {
  console.log('') // Newline
  console.log('Looking for data files in ' + dataPath)

  let presskits = {}
  presskits.products = []
  let count = 0

  // 1 - get all presskits
  // Inspect given path for data files
  let files = sfs.findAllFiles(dataPath, { maxDepth: 1, ignoredFolders: ['build', 'node_modules'] })

  files.filter(isDataFile).forEach(file => {
    try {
      let presskit = loader.loadDataFile(file)
      if (!presskit) return

      console.log('- ' + presskit.type + ': "' + presskit.title + '" (' + file + ')')

      if (presskit.type === 'company') {
        if (presskits.company) {
          console.error('Multiple companies detected. This is not supported yet, only the last will be used!')
        }

        presskits.company = { path: dataPath, presskit: presskit }
      } else {
        presskits.products.push({ path: file, presskit: presskit })
      }

      count++
    } catch (err) {
      console.error(err)
    }
  })

  console.log('')

  if (count === 0) {
    console.warn('No data files found!')
    return
  }

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

  console.log('')
  console.log('Exporting assets (CSS, etc)...')

  // Copy assets (CSS and stuff)
  copyMandatoryFiles(dataPath)

  console.log('')
  console.log('Done! 👌')
  console.log('')
}

// Build the HTML
function build (basePath, dataFile, presskit, relatedProducts, outputJSONfiles) {
  // Get template
  let templatePath
  if (presskit.type === 'product') {
    templatePath = templatesPath.product
  } else if (presskit.type === 'company') {
    templatePath = templatesPath.company
  }

  if (!templatePath) {
    console.error('Missing template! Make sure your presskit has a "type" field (product/company)')
    return
  }

  let t = fs.readFileSync(templatePath, 'utf-8')
  let template = handlebars.compile(t)

  // Call Handlebars
  let html = template({ presskit: presskit, products: relatedProducts })

  // Export result in HTML
  // -- Ensure ./build exists
  let buildDir = getBuildDir(basePath)

  let targetDir = buildDir

  if (presskit.type !== 'company') {
    // Company should be placed in the root folder
    // but each product is a subfolder, named as the source's folder name
    targetDir = path.join(buildDir, path.basename(path.dirname(dataFile)))
    sfs.createDir(targetDir)
  }

  // Prepare output filename
  let htmlFilename = 'index.html'
  let htmlDestination = path.join(targetDir, htmlFilename)

  console.log('- ' + presskit.title + ' ->  ' + htmlDestination)

  // -- Write HTML
  fs.writeFileSync(htmlDestination, html)

  // -- Copy all assets from images/ to build/images/
  let assetsSourceDir = path.join(path.dirname(dataFile), 'images')
  if (fs.existsSync(assetsSourceDir)) {
    let assetsTargetDir = path.join(targetDir, 'images')

    // Create target dir if necessary
    sfs.createDir(assetsTargetDir)

    // Copy all assets from source to target
    fs.readdirSync(assetsSourceDir).forEach(function (name) {
      let source = path.join(assetsSourceDir, name)
      let target = path.join(assetsTargetDir, name)
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

// Add css and any mandatory files specified to the build directory
function copyMandatoryFiles (basePath) {
  let buildDir = getBuildDir(basePath)

  for (let f of assetsToCopy) {
    let filepath = path.resolve(f)
    let filename = path.basename(filepath)
    let dir = path.basename(path.dirname(filepath))

    let targetDir = path.join(buildDir, dir)
    sfs.createDir(targetDir)

    let targetPath = path.join(targetDir, filename)

    console.log('- ' + targetPath)
    fs.writeFileSync(targetPath, fs.readFileSync(filepath))
  }
}

// Create and returns the path to the build directory from the given path
function getBuildDir (basePath) {
  let buildDir = path.join(basePath, 'build')
  sfs.createDir(buildDir)
  return buildDir
}

// -------------------------------------------------------------
// Exports.
// -------------------------------------------------------------

module.exports = {
  generate
}
