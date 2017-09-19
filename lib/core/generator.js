'use strict'

const fs = require('fs')
const path = require('path')

const rimraf = require('rimraf')
const chalk = require('chalk')

const console = require('../helpers/color-console')
const sfs = require('../helpers/sfs')
const {installWatcher, installDevelopmentWatcher} = require('../helpers/watcher')

const {build, createAndGetBuildFolder} = require('./builder')
const loader = require('./loader')

const {assetsToCopy} = require('../assets')
const config = require('../config')

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

function generate (entryPoint) {
  console.log(`Starting directory: ${chalk.green(entryPoint)}`)

  cleanBuildFolder()

  const pages = findData(entryPoint)

  if (countDataFiles(pages) === 0) {
    console.log('')
    console.warn('No data files found!')
    return
  }

  if (!pages.company) {
    console.log('')
    console.error('No company data file found!')
    return
  }

  generateHTML(pages)
  exportAssets()

  console.log('')
  console.log('Done! 👌')

  if (config.commands.build.watch) {
    const port = config.commands.build.port
    const address = chalk.green(`http://localhost:${port}/`)
    showHeader(`Watching and serving files from ${address}`)
    startWatcher(entryPoint, () => generateHTML(findData(entryPoint)))
  }
}

function cleanBuildFolder () {
  if (!config.commands.build.cleanBuildFolder) return

  showHeader('Cleaning build folder')
  rimraf.sync(createAndGetBuildFolder())
}

function findData (entryPoint) {
  showHeader('Finding data')

  const pages = {products: []}

  // Inspect given path for data files and get all correct ones.
  let files = sfs.findAllFiles(entryPoint, { maxDepth: 1, ignoredFolders: ['build', 'node_modules'] })

  files.filter(isDataFile).forEach(file => {
    try {
      let presskit = loader.loadDataFile(file)
      if (!presskit) return

      console.log(`- ${presskit.type}: "${presskit.title}" ${chalk.dim(file)}`)

      // presskit() compatibility support:
      // If we find a "game" file at the top-level, it's probably a company.
      const isTopLevel = path.relative(path.dirname(file), entryPoint) === ''
      if (isTopLevel && presskit.type !== 'company') {
        console.warn('This top-level `data.xml` root tag should be `<company>`, not `<game>`! ')
        console.warn('If this is a legacy presskit(), please check the migration guide:')
        console.log(chalk.blue('https://github.com/pixelnest/presskit.html#migration-guide'))
        console.log('')

        presskit.type = 'company'
      }

      if (presskit.type === 'company') {
        if (pages.company) {
          console.warn('Multiple companies detected. This is not supported yet, only the last will be used!')
        }

        pages.company = { path: entryPoint, presskit: presskit }
      } else {
        pages.products.push({ path: file, presskit: presskit })
      }
    } catch (err) {
      console.error(`There was an error during the parsing of \`${file}\`. Check that your XML document is valid.`)
      console.error('You can use a validator like this: ' + chalk.blue('http://codebeautify.org/xmlvalidator'))
      process.exit()
    }
  })

  return pages
}

function generateHTML (pages) {
  showHeader('Generating HTML')

  const productsList = []

  let analytics = ''
  if (pages.company && pages.company.presskit.analytics) {
    analytics = pages.company.presskit.analytics
  }

  for (const product of pages.products) {
    const outputPath = build(
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
      pages.company.path,
      pages.company.presskit,
      {
        products: productsList,
        analytics
      }
    )
  }
}

function exportAssets () {
  showHeader('Exporting assets')

  // Copy assets (CSS and stuff)
  copyMandatoryFiles()
}

// Print a console UI header text.
function showHeader (text) {
  console.log('')
  console.log(chalk.magenta(text + '…'))
}

// Add css and any mandatory files specified to the build directory
function copyMandatoryFiles () {
  let buildDir = createAndGetBuildFolder()

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

// Start watching files and assets.
function startWatcher (entryPoint, callback) {
  if (config.commands.build.dev) {
    // Delete the assets (CSS/etc.) before.
    // They might not be there, but we must ensure that they are properly
    // deleted.
    //
    // This is necessary, otherwise, remaining copied CSS files will have
    // an higher priority than the ones provided by the server (from
    // the `assets/` folder).
    rimraf(path.join(createAndGetBuildFolder(), 'css'), () => {
      installDevelopmentWatcher(entryPoint, callback)
    })
  } else {
    installWatcher(entryPoint, callback)
  }
}

// -------------------------------------------------------------
// Exports.
// -------------------------------------------------------------

module.exports = {
  generate
}
