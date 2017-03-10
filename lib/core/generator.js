'use strict'

const fs = require('fs')
const path = require('path')

const rimraf = require('rimraf')
const chalk = require('chalk')

const console = require('../helpers/color-console')
const sfs = require('../helpers/sfs')
const {installWatcher} = require('../helpers/watcher')

const {build, getBuildFolder} = require('./builder')
const loader = require('./loader')

const {assetsToCopy} = require('../assets')
const config = require('../config')

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

function generate (dataPath) {
  console.log(`Starting directory: ${chalk.green(dataPath)}`)

  const pages = findData(dataPath)

  if (countDataFiles(pages) === 0) {
    console.log('')
    console.warn('No data files found!')
    return
  }

  generateHTML(dataPath, pages)
  exportAssets(dataPath)

  console.log('')
  console.log('Done! 👌')

  if (config.commands.build.watch) {
    // Delete the assets (CSS/etc.) and install watchers.
    rimraf(path.join(dataPath, 'build/css'), () => {
      showHeader('Watching files')
      installWatcher(dataPath, () => generateHTML(dataPath, findData(dataPath)))
    })
  }
}

function findData (dataPath) {
  showHeader('Finding data')

  const pages = {products: []}

  // Inspect given path for data files and get all correct ones.
  let files = sfs.findAllFiles(dataPath, { maxDepth: 1, ignoredFolders: ['build', 'node_modules'] })

  files.filter(isDataFile).forEach(file => {
    try {
      let presskit = loader.loadDataFile(file)
      if (!presskit) return

      console.log(`- ${presskit.type}: "${presskit.title}" ${chalk.dim(file)}`)

      if (presskit.type === 'company') {
        if (pages.company) {
          console.warn('Multiple companies detected. This is not supported yet, only the last will be used!')
        }

        pages.company = { path: dataPath, presskit: presskit }
      } else {
        pages.products.push({ path: file, presskit: presskit })
      }
    } catch (err) {
      console.error(err)
    }
  })

  return pages
}

function generateHTML (dataPath, pages) {
  showHeader('Generating HTML')

  const productsList = []

  let analytics = ''
  if (pages.company && pages.company.presskit.analytics) {
    analytics = pages.company.presskit.analytics
  }

  for (const product of pages.products) {
    const outputPath = build(
      dataPath,
      product.path,
      product.presskit,
      {
        company: pages.company.presskit,
        analytics
      }
    )

    productsList.push({path: outputPath, title: product.presskit.title})
  }

  // Company should be the last one, listing all the products
  if (pages.company) {
    // Notice that we provide a ref to all the products here.
    build(
      dataPath,
      pages.company.path,
      pages.company.presskit,
      {
        products: productsList,
        analytics
      }
    )
  }
}

function exportAssets (dataPath) {
  showHeader('Exporting assets')

  // Copy assets (CSS and stuff)
  copyMandatoryFiles(dataPath)
}

// Print a console UI header text.
function showHeader (text) {
  console.log('')
  console.log(chalk.yellow(text + '…'))
}

// Add css and any mandatory files specified to the build directory
function copyMandatoryFiles (basePath) {
  let buildDir = getBuildFolder(basePath)

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

// Count the number of products/company in the presskit.
function countDataFiles (pages) {
  let count = 0
  count += (pages.company ? 1 : 0)
  count += pages.products.length

  return count
}

// Is a file qualifying to be a data file? ie. `data.xml`.
// We don't check the content here, just the name.
function isDataFile (filename) {
  var ext = path.extname(filename)
  filename = path.basename(filename, ext)

  return filename === 'data' && ext === '.xml'
}

// -------------------------------------------------------------
// Exports.
// -------------------------------------------------------------

module.exports = {
  generate
}
