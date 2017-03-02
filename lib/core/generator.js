'use strict'

const fs = require('fs')
const path = require('path')

const chalk = require('chalk')

const console = require('../helpers/color-console')
const sfs = require('../helpers/sfs')
const {build, getBuildFolder} = require('./builder')
const loader = require('./loader')

const {assetsToCopy} = require('../assets')

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

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
