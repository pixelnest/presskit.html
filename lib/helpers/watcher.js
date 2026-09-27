'use strict'

const fs = require('fs')
const path = require('upath')
const chokidar = require('chokidar')
const bs = require('browser-sync').create()

const config = require('../config')
const { assets } = require('../assets')

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

// Simple watcher used by the end-user.
// It only checks the data files and will launch a server on the build
// folder.
// It ignores the templates and CSS files changes.
function installWatcher (startingFolder, callback) {
  bs.init({
    server: config.commands.build.output,
    port: config.commands.build.port,
    ui: false,
    open: false,
    logLevel: 'silent'
  })

  const watcher = createWatcher(path.join(startingFolder, '**/data.xml'))

  watcher.on('change', () => {
    callback()
    bs.reload()
  })
}

// Complex watcher to develop the CSS and templates of this project.
// Will check the data files, the templates AND the CSS.
function installDevelopmentWatcher (startingFolder, callback, themeCssPath) {
  const buildFolder = config.commands.build.output

  // BrowserSync will watch for changes in the assets CSS.
  // It will also create a server with the build folder and the assets.
  //
  // Pages link to `theme.css`, not to the theme's real filename, so
  // BrowserSync can't match a change of the theme file to a stylesheet.
  // We watch the theme separately and inject it as `theme.css`.
  bs.init({
    server: [buildFolder, assets],
    port: config.commands.build.port,
    files: [
      path.join(assets, '**/*.css'),
      {
        match: [themeCssPath],
        fn: (event) => {
          if (event === 'change') bs.reload('theme.css')
        }
      }
    ],
    middleware: [serveThemeCss(themeCssPath)],
    ui: false,
    open: false
  })

  // Meanwhile, the watcher will monitor changes in the templates
  // and the data files.
  // Then, when a change occurs, it will regenerate the site through
  // the provide callback.
  const templateFolder = path.join(assets, '**/*.html')
  const dataFolder = path.join(startingFolder, '**/data.xml')

  const watcher = createWatcher(templateFolder, dataFolder)

  watcher.on('change', () => {
    callback()
    bs.reload()
  })
}

// Pages link to `css/theme.css`, which doesn't exist in the assets folder.
// Serve the selected theme file in its place.
function serveThemeCss (themeCssPath) {
  return (req, res, next) => {
    const url = req.url.split('?')[0]
    if (!url.endsWith('/css/theme.css') || !fs.existsSync(themeCssPath)) {
      return next()
    }

    res.setHeader('Content-Type', 'text/css')
    fs.createReadStream(themeCssPath).pipe(res)
  }
}

function createWatcher (...folders) {
  const watcher = chokidar.watch(folders, {
    ignored: /(^|[/\\])\../,
    persistent: true
  })

  return watcher
}

// -------------------------------------------------------------
// Exports.
// -------------------------------------------------------------

module.exports = {
  installWatcher,
  installDevelopmentWatcher
}
