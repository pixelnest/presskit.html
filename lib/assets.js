'use strict'

const path = require('upath')

// -------------------------------------------------------------
// Constants.
// -------------------------------------------------------------

const assets = path.join(__dirname, '../assets')

const assetsToCopy = [
  path.join(assets, 'css/master.css'),
  path.join(assets, 'css/normalize.css'),
  path.join(assets, 'js/hamburger.js'),
  path.join(assets, 'js/imagesloaded.min.js'),
  path.join(assets, 'js/masonry.min.js')
]

const companyTemplate = path.join(assets, 'templates/company.xml')
const productTemplate = path.join(assets, 'templates/product.xml')

const imagesFolderName = 'images'
const authorizedImageFormats = ['.jpg', '.jpeg', '.png', '.gif']

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
