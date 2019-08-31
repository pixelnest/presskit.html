'use strict'

const fs = require('fs')
const path = require('upath')
const chalk = require('chalk')
const sharp = require('sharp')

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

async function build (dataFilePath, presskit, {
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
  const template = createTemplate(presskit.type, pageFolder)
  const assetsSource = getImagesFolder(dataFilePath)
  const images = getImages(assetsSource)

  // Copy images and zips to the page folder.
  const assetsTarget = path.join(pageFolder, imagesFolderName)
  sfs.copyDirContent(assetsSource, assetsTarget)

  // Add thumbnails on the screenshot images.
  // Because the thumbnails are not in the `images` object, they won't
  // be added to the zips. Neat.
  if (!config.commands.build.ignoreThumbnails) {
    await createThumbnails(assetsTarget, images.screenshots)
  }

  // This must be done after `sfs.copyDirContent`.
  // Otherwise, we might override existing archives.
  exportArchives(images, assetsSource, assetsTarget)

  // Apply data to template.
  let html = template({
    presskit: presskit,
    company,
    products,
    images: sortScreenshotsByCategories(images),
    assets: (presskit.type !== 'company' ? '..' : '.'),
    analytics,

    // Handlebars can't check for equality, so we provide two
    // variables to differentiate a product and a company sheet.
    isCompany: presskit.type === 'company',
    isProduct: presskit.type === 'product',

    // Same to know if a presskit has any screenshots.
    hasScreenshots: images.screenshots && images.screenshots.length > 0,

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

// Get an absolute page url from its location in the build process.
function getAbsolutePageUrl (dataFilePath, pageType) {
  const buildFolder = createAndGetBuildFolder()
  const pageFolder = getPageFolder(buildFolder, dataFilePath, pageType)

  const htmlFilePath = getHtmlFilePath(pageFolder)
  const relativePath = path.posix.relative(buildFolder, htmlFilePath)

  return path.posix.join(config.commands.build.baseUrl, relativePath)
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

  sfs.findAllFiles(source)
    .forEach(filePathWithSource => {
      // Remove 'path/to/images' from 'path/to/images/filename'.
      // ie, 'data/product/images/burger01.png' becomes 'burger01.png'.
      // This is super important. We only need this portion for:
      // - the comparison below
      // - the url on the site
      // - the copy to the built presskit
      const f = path.relative(source, filePathWithSource)

      // Authorize only these formats.
      const ext = path.extname(f)
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

// This function takes a list of images and separate the images which are
// in a folder into separate categories.
//
// **Pure function.**
//
//   Example:
//     - burger01.png
//     - gifs/burger02.png
//     - wallpapers/burger03.png
//     - wallpapers/burger04.png
//   → {
//     ...
//     screenshots: ['burger01.png']
//     screenshotsWithCategory: {
//       gifs: {title: 'gifs', elements: ['gifs/burger02.png']}
//       wallpapers: {title: 'gifs', elements: ['wallpapers/burger03.png', 'wallpapers/burger04.png']}
//     }
//     ...
//   }
function sortScreenshotsByCategories (images) {
  const clone = {...images}

  // Abort early if no screenshots.
  const screenshots = clone.screenshots
  if (!screenshots) return clone

  // We put category-less screenshots first. This is important.
  const result = []
  const withCategories = {}

  for (const i of screenshots) {
    // We get the category from the dirname.
    const category = path.dirname(i)

    // Separate the screenshots which are at the root of the images folder.
    // They must be first, so we store them in another array.
    if (category === '.') {
      result.push(i)
    } else {
      // Create a new category first.
      if (!withCategories[category]) {
        withCategories[category] = {}
        withCategories[category].title = category
        withCategories[category].elements = []
      }

      withCategories[category].elements.push(i)
    }
  }

  clone.screenshots = result
  clone.screenshotsWithCategory = withCategories
  return clone
}

// Create thumbnails.
// For each provided images, generate a low-res jpg thumbnail.
// Even for gif.
//
// We don't check if the format of the images is valid,
// since the check is already done when constructing the images object.
async function createThumbnails (target, images) {
  for (const x of images) {
    const imagePath = path.join(target, x)
    const thumbPath = path.join(target, `${x}.thumb.jpg`)

    try {
      // Background and flatten are for transparent PNGs/Gifs.
      // We force a white background here.

      await sharp(imagePath)
        .resize(450)
        .flatten({background: {r: 255, g: 255, b: 255, alpha: 1}})
        .jpeg()
        .toFile(thumbPath)
    } catch (e) {
      const msg = chalk.dim(`(${e.message})`)
      console.warn(`The '${chalk.bold(x)}' thumbnail has not been generated. ${msg}`)
    }
  }
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
  getAbsolutePageUrl,
  createAndGetBuildFolder
}
