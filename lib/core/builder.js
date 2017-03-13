'use strict'

const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

const console = require('../helpers/color-console')
const sfs = require('../helpers/sfs')
const zip = require('../helpers/zip')

const {createTemplate} = require('./template')

const config = require('../config')
const {imagesFolderName, authorizedImageFormats} = require('../assets')

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

function build (dataFile, presskit, {
  company = {},
  products = [],
  analytics = ''
} = {}) {
  const template = createTemplate(presskit.type)
  const assetsSource = getImagesFolder(dataFile)
  const images = getImages(assetsSource)

  // Apply data to template.
  let html = template({
    presskit: presskit,
    company,
    products,
    images: images,
    assets: (presskit.type !== 'company' ? '..' : '.'),
    analytics,

    // Handlebars can't check for equality, so we provide two
    // variables to differentiate a product and a company sheet.
    isCompany: presskit.type === 'company',
    isProduct: presskit.type === 'product'
  })

  const buildDir = createAndGetBuildFolder()
  let targetDir = buildDir

  if (presskit.type !== 'company') {
    // Company should be placed in the root folder.
    // but each product is a subfolder, named as the source's folder name.
    targetDir = path.join(buildDir, path.basename(path.dirname(dataFile)))
    sfs.createDir(targetDir)
  }

  // Prepare output filename.
  let htmlFilename = 'index.html'
  let htmlDestination = path.join(targetDir, htmlFilename)

  console.log(`- "${presskit.title}" -> ${chalk.blue(htmlDestination)}`)

  // Export the HTML to a file.
  fs.writeFileSync(htmlDestination, html)

  // Copy all assets from `images/` to `build/images/`.
  let assetsTarget = path.join(targetDir, imagesFolderName)
  if (fs.existsSync(assetsSource)) {
    // Create target dir if necessary.
    sfs.createDir(assetsTarget)

    // Copy all assets from source to target.
    fs.readdirSync(assetsSource).forEach(function (name) {
      let source = path.join(assetsSource, name)
      let target = path.join(assetsTarget, name)
      fs.writeFileSync(target, fs.readFileSync(source))
    })
  }

  // Create an archive for images.
  if (images) {
    if (images.screenshots) {
      zip('images.zip', images.screenshots, assetsSource, assetsTarget)
    }
    if (images.logos) {
      zip('logo.zip', images.logos, assetsSource, assetsTarget)
    }
  }

  // Output relative path from `build/`.
  return path.relative(buildDir, htmlDestination)
}

// Get the folder containing the images.
function getImagesFolder (dataFile) {
  const stat = fs.statSync(dataFile)
  const dataFileFolder = stat.isFile() ? path.dirname(dataFile) : dataFile

  return path.join(dataFileFolder, imagesFolderName)
}

// Get the images in the source, and sort them by types.
// We are interested in three types of images:
// - the header, starting with 'header'.
// - the logos, starting with 'logo'.
// - And the rest (what we call "screenshots").
function getImages (source) {
  if (!fs.existsSync(source)) {
    console.error(`No images found for "${source}"`, '🤔')
    return
  }

  const images = {header: null, screenshots: [], logos: []}

  fs.readdirSync(source)
    .forEach(f => {
      const ext = path.extname(f)

      // Authorize only these formats.
      if (!authorizedImageFormats.includes(ext)) return

      // And put in the correct category.
      if (f.toLowerCase().startsWith('header')) {
        images.header = f
      } else if (f.toLowerCase().startsWith('logo')) {
        images.logos.push(f)
      } else {
        images.screenshots.push(f)
      }
    })

  return images
}

function createAndGetBuildFolder () {
  const destination = path.join(config.commands.build.output || process.cwd(), 'build')
  sfs.createDir(destination)

  return destination
}

// -------------------------------------------------------------
// Exports.
// -------------------------------------------------------------

module.exports = {
  build,
  createAndGetBuildFolder
}
