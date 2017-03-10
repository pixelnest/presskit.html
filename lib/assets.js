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

const data = path.join(__dirname, '../data')
const companyTemplate = path.join(data, 'data.xml')
const productTemplate = path.join(path.join(data, 'product'), 'data.xml')

const imagesFolderName = 'images'
const authorizedImageFormats = ['.jpg', '.jpeg', '.png']

// -------------------------------------------------------------
// Exports.
// -------------------------------------------------------------

module.exports = {
  assets,
  assetsToCopy,
  imagesFolderName,
  authorizedImageFormats,
  companyTemplate,
  productTemplate
}
