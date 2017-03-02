'use strict'

const path = require('path')

// -------------------------------------------------------------
// Constants.
// -------------------------------------------------------------

const assets = path.join(__dirname, '../assets')

const assetsToCopy = [
  path.join(assets, 'css/master.css'),
  path.join(assets, 'css/normalize.css')
]

// -------------------------------------------------------------
// Exports.
// -------------------------------------------------------------

module.exports = {
  assets,
  assetsToCopy
}
