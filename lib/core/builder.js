'use strict'

const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

const console = require('../helpers/color-console')
const sfs = require('../helpers/sfs')
const zip = require('../helpers/zip')

const {createTemplate} = require('./template')

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

function build (basePath, dataFile, presskit, relatedProducts) {
  const template = createTemplate(presskit.type)

  // List all images before rendering the template
  // ---------------------------------------------------------------
  let stat = fs.statSync(dataFile)
  let assetsSourceDir = path.join(dataFile, 'images')
  if (stat.isFile()) {
    assetsSourceDir = path.join(path.dirname(dataFile), 'images')
  }

  let images = {screenshots: [], logos: [], icons: []}

  if (fs.existsSync('images')) {
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
  }

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
  let buildDir = getBuildFolder(basePath)

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

// Create and returns the path to the build directory from the given path
function getBuildFolder (basePath) {
  let buildDir = path.join(basePath, 'build')
  sfs.createDir(buildDir)
  return buildDir
}

// -------------------------------------------------------------
// Exports.
// -------------------------------------------------------------

module.exports = {
  build,
  getBuildFolder
}
