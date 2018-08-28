'use strict'

const fs = require('fs')
const path = require('upath')
const chalk = require('chalk')

const console = require('./helpers/color-console')
const generator = require('./core/generator')
const config = require('./config')

const assets = require('./assets')
const sfs = require('./helpers/sfs')

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

function runBuildCommand (launchOptions) {
  config.commands.build = launchOptions

  parseEntryPoint(launchOptions.entryPoint, (err, entry) => {
    if (err) {
      console.warn('No valid entry point provided. Use current directory instead')
      console.log('')

      generator.generate(process.cwd())
      return
    }

    generator.generate(entry)
  })
}

function parseEntryPoint (entry, cb) {
  // No file provided? Just return the current working dir.
  if (!entry) {
    return cb(null, process.cwd())
  }

  // Check if the entry is valid.
  // And ensure that we use a directory.
  fs.stat(entry, (err, stat) => {
    if (err) {
      return cb(new Error('Not a file'))
    }

    if (stat.isDirectory()) {
      cb(null, entry)
    } else if (stat.isFile()) {
      cb(null, path.dirname(entry))
    } else {
      cb(new Error('Not a directory or file'))
    }
  })
}

function runNewCommand (type, destination) {
  if (type !== 'company' && type !== 'product') {
    console.error('Unknow type. Expected "company" or "product"')
    return
  }

  const isProduct = (type === 'product')
  const source = (isProduct ? assets.productTemplate : assets.companyTemplate)

  let targetDir = destination

  // Create subfolder for product.
  if (isProduct) {
    targetDir = path.join(destination, 'product')
    sfs.createDir(targetDir)
  }

  let target = path.join(targetDir, 'data.xml')

  // Copy files from examples to target directory.
  fs.writeFileSync(target, fs.readFileSync(source))

  // Create images folder.
  sfs.createDir(path.join(targetDir, 'images'))

  console.log(`Creating new ${type} template: ${chalk.blue(target)}`)
  console.log('')
  console.log('Done! 👌')
}

// -------------------------------------------------------------
// Exports.
// -------------------------------------------------------------

module.exports = {
  runBuildCommand,
  runNewCommand
}
