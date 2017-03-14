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

  const buildFolder = createAndGetBuildFolder()
  const pageFolder = createAndGetPageFolder(buildFolder, presskit, dataFile)

  const assetsTarget = path.join(pageFolder, imagesFolderName)

  // Export images and zips.
  exportImages(assetsSource, assetsTarget)
  exportArchives(images, assetsSource, assetsTarget)

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

  // Export the HTML to a file.
  const htmlDestination = path.join(pageFolder, 'index.html')
  fs.writeFileSync(htmlDestination, html)

  console.log(`- "${presskit.title}" -> ${chalk.blue(htmlDestination)}`)

  // And return the relative path from `build/`.
  return path.relative(buildFolder, htmlDestination)
}

// -------------------------------------------------------------
// Folders.
// -------------------------------------------------------------

function createAndGetBuildFolder () {
  const destination = path.join(config.commands.build.output || process.cwd(), 'build')
  sfs.createDir(destination)

  return destination
}

function createAndGetPageFolder (buildFolder, page, dataFile) {
  if (page.type !== 'company') {
    // Company should be placed in the root folder.
    // But each product is a subfolder.
    // Its name is the product's name.
    const name = path.basename(path.dirname(dataFile))
    const subfolder = path.join(buildFolder, name)
    sfs.createDir(subfolder)
    return subfolder
  }

  // Company's page? It's the build folder!
  return buildFolder
}

// -------------------------------------------------------------
// Images.
// -------------------------------------------------------------

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

// Copy all assets from `images/` to `build/images/`.
// Export images as zip.
function exportImages (source, target) {
  if (!fs.existsSync(source)) return

  // Create target dir if necessary.
  sfs.createDir(target)

  // Copy all assets from source to target.
  fs.readdirSync(source).forEach((name) => {
    const sourceFile = path.join(source, name)
    const targetFile = path.join(target, name)
    fs.writeFileSync(targetFile, fs.readFileSync(sourceFile))
  })
}

// -------------------------------------------------------------
// Archives.
// -------------------------------------------------------------

// Export archives for screenshots and logos.
function exportArchives (images, source, target) {
  if (!images) return

  createArchive('images', target, source, images.screenshots)
  createArchive('logo', target, source, images.logos)
}

function createArchive (name, target, source, files) {
  if (!files) return
  zip(name, target, source, files)
}

// -------------------------------------------------------------
// Exports.
// -------------------------------------------------------------

module.exports = {
  build,
  createAndGetBuildFolder
}
