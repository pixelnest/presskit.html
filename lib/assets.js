'use strict'

const path = require('path')

// -------------------------------------------------------------
// Constants.
// -------------------------------------------------------------

const assets = path.join(__dirname, '../assets')

const assetsToCopy = [
  path.join(assets, 'css/master.css'),
  path.join(assets, 'css/normalize.css'),
  path.join(assets, 'js/imagesloaded.min.js'),
  path.join(assets, 'js/masonry.min.js')
]

const imagesFolderName = 'images'

// -------------------------------------------------------------
// Exports.
// -------------------------------------------------------------

module.exports = {
  assets,
  assetsToCopy,
  imagesFolderName
}
