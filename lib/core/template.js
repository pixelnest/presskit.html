'use strict'

const fs = require('fs')
const path = require('path')
const {parse: parseURL} = require('url')
const handlebars = require('handlebars')

const {assets} = require('../assets')

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

// Create a template object from a template of the assets folder.
// Use the type to determine which template must be selected.
function createTemplate (type) {
  const templatePath = getTemplatePath(assets, type)

  if (!templatePath) {
    throw new Error('Missing template! Make sure your presskit has a "type" field (product/company)')
  }

  registerPartials(assets)
  registerHelpers()

  const template = fs.readFileSync(templatePath, 'utf-8')
  return handlebars.compile(template)
}

// Get the path to the corresponding template in the assets folder.
function getTemplatePath (folder, type) {
  switch (type) {
    case 'product':
      return path.join(folder, 'product.html')
    case 'company':
      return path.join(folder, 'company.html')
  }
}

// Add all the required partials.
function registerPartials (folder) {
  const partialsFolder = path.join(folder, '_includes')

  const partials = fs.readdirSync(partialsFolder)
    .filter(isValidPartial)
    .reduce((result, partial) => {
      const ext = path.extname(partial)
      const fileFullPath = path.join(partialsFolder, partial)
      const data = fs.readFileSync(fileFullPath, 'utf-8')

      // Store as `"filename without extension": content`.
      result[path.basename(partial, ext)] = data
      return result
    }, {})

  handlebars.registerPartial(partials)
}

function registerHelpers () {
  handlebars.registerHelper({
    prettyURL: function (link) {
      const url = parseURL(link)
      if (!url.hostname) return link

      const path = url.pathname === '/' ? '' : url.pathname
      return url.hostname + path
    },

    domainURL: function (link) {
      const url = parseURL(link)
      if (!url.hostname) return link

      return url.hostname
    },

    permalink: function (link) {
      if (link.endsWith('index.html')) {
        return path.dirname(link) + '/'
      }

      return link
    },

    basename: function (name) {
      const ext = path.extname(name)
      return path.basename(name, ext)
    }
  })
}

// Is the file an HTML file?
function isValidPartial (file) {
  const ext = path.extname(file)
  return ext === '.html'
}

// -------------------------------------------------------------
// Exports.
// -------------------------------------------------------------

module.exports = {
  createTemplate
}
