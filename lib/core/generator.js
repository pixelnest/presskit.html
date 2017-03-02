'use strict'

const fs = require('fs')
const path = require('path')

const chalk = require('chalk')

const console = require('../helpers/color-console')
const sfs = require('../helpers/sfs')
const zip = require('../helpers/zip')
const {createTemplate} = require('./template')

const loader = require('./loader')

const assets = path.join(__dirname, '../../assets')

const assetsToCopy = [
  path.join(assets, 'css/master.css'),
  path.join(assets, 'css/normalize.css')
]

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

function isDataFile (filename) {
  var ext = path.extname(filename)
  filename = path.basename(filename, ext)

  return filename === 'data' && ext === '.xml'
}

function generate (dataPath) {
  console.log(`Starting directory: ${chalk.green(dataPath)}`)
  console.log('')
  console.log(chalk.yellow('Finding data…'))

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

      console.log(`- ${presskit.type}: "${presskit.title}" ${chalk.dim(file)}`)

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

  console.log(chalk.yellow('Generating HTML…'))

  // 2 - generates all presskits.
  let outputProducts = []
  for (let i = 0, len = presskits.products.length; i < len; i++) {
    let p = presskits.products[i]

    let outputPath = build(dataPath, p.path, p.presskit, [])
    outputProducts.push({path: outputPath, title: p.presskit.title})
  }

  // Company should be the last one, listing all the products
  if (presskits.company) {
    // Get a ref to all products
    build(dataPath, presskits.company.path, presskits.company.presskit, outputProducts)
  }

  console.log('')
  console.log(chalk.yellow('Exporting assets…'))

  // Copy assets (CSS and stuff)
  copyMandatoryFiles(dataPath)

  console.log('')
  console.log('Done! 👌')
}

// Build the HTML
function build (basePath, dataFile, presskit, relatedProducts) {
  const template = createTemplate(assets, presskit.type)

  // List all images before rendering the template
  // ---------------------------------------------------------------
  let stat = fs.statSync(dataFile)
  let assetsSourceDir = path.join(dataFile, 'images')
  if (stat.isFile()) {
    assetsSourceDir = path.join(path.dirname(dataFile), 'images')
  }

  let images = {screenshots: [], logos: [], icons: []}
  fs.readdirSync(assetsSourceDir).forEach(function (f) {
    let ext = path.extname(f)
    if (ext !== '.zip') {
      if (f.toLowerCase().startsWith('header')) {
        images.header = f
      } else if (f.toLowerCase().startsWith('logo')) {
        images.logos.push(f)
      } else if (f.toLowerCase().startsWith('icon')) {
        images.icons.push(f)
      } else {
        images.screenshots.push(f)
      }
    }
  })

  // Apply data to template.
  let html = template({
    presskit: presskit,
    products: relatedProducts,
    images: images,
    assets: (presskit.type !== 'company' ? '..' : '.')
  })

  // Export result in HTML
  // ---------------------------------------------------------------
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

  console.log(`- "${presskit.title}" -> ${chalk.blue(htmlDestination)}`)

  // -- Write HTML
  fs.writeFileSync(htmlDestination, html)

  // Copy all assets from images/ to build/images/
  // ---------------------------------------------------------------
  let assetsTargetDir = path.join(targetDir, 'images')
  if (fs.existsSync(assetsSourceDir)) {
    // Create target dir if necessary
    sfs.createDir(assetsTargetDir)

    // Copy all assets from source to target
    fs.readdirSync(assetsSourceDir).forEach(function (name) {
      let source = path.join(assetsSourceDir, name)
      let target = path.join(assetsTargetDir, name)
      fs.writeFileSync(target, fs.readFileSync(source))
    })
  }

  // Create an archive for images.
  zip('images.zip', images.screenshots, assetsSourceDir, assetsTargetDir)
  zip('logo.zip', images.logos.concat(images.icons), assetsSourceDir, assetsTargetDir)

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
