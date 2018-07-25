'use strict'

const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

const packageVersion = require('../../package.json').version

const console = require('../helpers/color-console')
const sfs = require('../helpers/sfs')
const zip = require('../helpers/zip')

const {createTemplate} = require('./template')

const config = require('../config')
const {imagesFolderName, authorizedImageFormats} = require('../assets')

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

function build (dataFilePath, presskit, {
  company = {},
  products = [],
  analytics = ''
} = {}) {
  const buildFolder = createAndGetBuildFolder()
  const pageFolder = getPageFolder(buildFolder, dataFilePath, presskit.type)

  // Create the page folder.
  sfs.createDir(pageFolder)

  const htmlFilePath = getHtmlFilePath(pageFolder)
  console.log(`- "${presskit.title}" -> ${chalk.blue(htmlFilePath)}`)

  // Templates and images.
  const template = createTemplate(presskit.type)
  const assetsSource = getImagesFolder(dataFilePath)
  const images = getImages(assetsSource)

  // Copy images and zips to the page folder.
  const assetsTarget = path.join(pageFolder, imagesFolderName)
  sfs.copyDirContent(assetsSource, assetsTarget)

  // This must be done after `sfs.copyDirContent`.
  // Otherwise, we might override existing archives.
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
    isProduct: presskit.type === 'product',

    // Additional build options:
    hamburger: config.commands.build.hamburger,

    // Misc.
    buildVersion: packageVersion,
    buildTime: new Date().getTime()
  })

  // Export the HTML to a file.
  fs.writeFileSync(htmlFilePath, html)

  // And return the relative path from `build/`.
  return path.relative(buildFolder, htmlFilePath)
}

// -------------------------------------------------------------
// Folders.
// -------------------------------------------------------------

function createAndGetBuildFolder () {
  const destination = config.commands.build.output
  sfs.createDir(destination)

  return destination
}

function getHtmlFilePath (pageFolder) {
  return path.join(pageFolder, 'index.html')
}

function getPageFolder (buildFolder, dataFilePath, pageType) {
  // Logic:
  // - Company page should be placed in the root folder.
  // - But each product page is a subfolder.

  // If it's not a company page, it means that the page is in a subfolder.
  if (pageType !== 'company') {
    const productFolderName = path.basename(path.dirname(dataFilePath))
    const subfolder = path.join(buildFolder, productFolderName)
    return subfolder
  }

  // Company's page? It's simply the build folder!
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

      // Ignore favicon.
      if (f.toLowerCase() === 'favicon.ico') return

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

// -------------------------------------------------------------
// Archives.
// -------------------------------------------------------------

// Export archives for screenshots and logos.
function exportArchives (images, source, target) {
  if (!images) return

  createArchive('images.zip', target, source, images.screenshots)
  createArchive('logo.zip', target, source, images.logos)
}

function createArchive (name, target, source, files) {
  if (!files) return

  // Do not override an existing archive.
  if (fs.existsSync(path.join(source, name))) {
    console.warn(`An existing archive named ${chalk.blue(name)} has been found in the assets. Keeping it…`)
    return
  }

  zip(name, target, source, files)
}

// -------------------------------------------------------------
// Exports.
// -------------------------------------------------------------

module.exports = {
  build,
  createAndGetBuildFolder
}
