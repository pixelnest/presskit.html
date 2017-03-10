'use strict'

const path = require('path')
const chokidar = require('chokidar')
const bs = require('browser-sync').create()

const config = require('../config')
const {assets} = require('../assets')

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

function installWatcher (startingFolder, callback) {
  const buildFolder = path.join(config.commands.build.output, './build')

  // BrowserSync will watch for changes in the assets CSS.
  // It will also create a server with the build folder an the assets.
  bs.init({
    server: [buildFolder, assets],
    port: 8080,
    files: path.join(assets, '**/*.css'),
    ui: false,
    open: false
  })

  // Meanwhile, chokidar will watch for changes in the templates
  // and the data files.
  // Then, when a change occurs, it will regenerate the site through
  // the provide callback.
  const templateFolder = path.join(assets, '**/*.html')
  const dataFolder = path.join(startingFolder, '**/data.xml')

  const watcher = chokidar.watch([templateFolder, dataFolder], {
    ignored: /(^|[/\\])\../,
    persistent: true
  })

  watcher.on('change', () => {
    callback()
    bs.reload()
  })
}

// -------------------------------------------------------------
// Exports.
// -------------------------------------------------------------

module.exports = {
  installWatcher
}
