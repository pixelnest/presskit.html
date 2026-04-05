'use strict'

const { promisify } = require('util')
const fs = require('fs')
const readFilePromised = promisify(fs.readFile)
const writeFilePromised = promisify(fs.writeFile)
const path = require('upath')

const chalk = require('chalk')

const console = require('../helpers/color-console')
const sfs = require('../helpers/sfs')
const { installWatcher, installDevelopmentWatcher } = require('../helpers/watcher')

const { build, createAndGetBuildFolder, getAbsolutePageUrl } = require('./builder')
const loader = require('./loader')

const { assetsToCopy, cssFolder } = require('../assets')
const config = require('../config')

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

async function generate (entryPoint) {
  console.log(`Starting directory: ${chalk.green(entryPoint)}`)

  cleanBuildFolder()

  const pages = findData(entryPoint)

  if (countDataFiles(pages) === 0) {
    console.log('')
    console.warn('No data files found!')
    return
  }

  await generateHTML(pages)
  await exportAdditionalAssets()

  console.log('')
  console.log('Done! 👌')

  if (config.commands.build.watch) {
    const port = config.commands.build.port
    const address = chalk.green(`http://localhost:${port}/`)
    showHeader(`Watching and serving files from ${address}`)
    startWatcher(entryPoint, () => generateHTML(findData(entryPoint)).catch(err => console.error(err.message)))
  }
}

function cleanBuildFolder () {
  if (!config.commands.build.cleanBuildFolder) return

  showHeader('Cleaning build folder')
  fs.rmSync(createAndGetBuildFolder(), { recursive: true, force: true })
}

function findData (entryPoint) {
  showHeader('Finding data')

  const pages = { products: [] }

  // Inspect given path for data files and get all correct ones.
  const files = sfs.findAllFiles(entryPoint, { maxDepth: 1, ignoredFolders: ['build', 'node_modules'] })

  files.filter(isDataFile).forEach(file => {
    try {
      const presskit = loader.loadDataFile(file)
      if (!presskit) return

      console.log(`- ${presskit.type}: "${presskit.title}" ${chalk.dim(file)}`)

      // Mark top-level products so they build to the root folder.
      const isTopLevel = path.relative(path.dirname(file), entryPoint) === ''
      if (isTopLevel && presskit.type !== 'company') {
        presskit.topLevel = true
      }

      if (presskit.type === 'company') {
        if (pages.company) {
          console.warn('Multiple companies detected. This is not supported yet, only the last will be used!')
        }

        pages.company = { path: file, presskit }
      } else {
        pages.products.push({ path: file, presskit })
      }
    } catch (err) {
      console.error(`There was an error during the parsing of \`${file}\`. Check that your XML document is valid.`)
      console.error('You can use a validator like this: ' + chalk.blue('http://codebeautify.org/xmlvalidator'))
      process.exit(1)
    }
  })

  return pages
}

async function generateHTML (pages) {
  showHeader('Generating HTML')

  const productsList = []

  let analytics = ''
  if (pages.company && pages.company.presskit.analytics) {
    analytics = pages.company.presskit.analytics
  }

  // Create dependency relations between products.
  // ie., if a product is a DLC of another, it will add
  // this link between the two products.
  addProductsRelations(pages.products)

  for (const product of pages.products) {
    const outputPath = await build(
      product.path,
      product.presskit,
      {
        company: pages.company ? pages.company.presskit : {},
        analytics
      }
    )

    productsList.push({ path: outputPath, title: product.presskit.title })
  }

  // Company should be the last one, listing all the products
  if (pages.company) {
    // Notice that we provide a ref to all the products here.
    await build(
      pages.company.path,
      pages.company.presskit,
      {
        products: productsList,
        analytics
      }
    )
  }
}

function addProductsRelations (products) {
  // Find a <relations> tag in each product.
  for (const currentProduct of products) {
    const relations = currentProduct.presskit.relations
    if (!relations) continue

    // Erase the old relations object and make it an array for future use.
    currentProduct.presskit.relations = []

    // Then go through each relation and add the links between the
    // current product and its target.
    relations.forEach(relation => {
      if (!relation.type || typeof relation.type !== 'string') return

      const type = relation.type.trim()
      const productId = cleanId(relation.product)

      // Find the target of the relation (ONE product per relation).
      const relatedProduct = products
        .filter(x => x !== currentProduct)
        .find(x => productId === cleanId(x.presskit.title))

      // Stop if nothing.
      if (!relatedProduct) return

      // Then add the relations.

      // On the current product:
      currentProduct.presskit.relations.push(
        createRelation(type, relatedProduct)
      )

      // And the target.
      if (!relatedProduct.presskit.relationOf) {
        relatedProduct.presskit.relationOf = []
      }

      relatedProduct.presskit.relationOf.push(createRelation(type, currentProduct))
    })
  }

  function cleanId (x) {
    if (!x || typeof x !== 'string') return ''

    return x.trim().toLowerCase().replace(/\s/g, '')
  }

  // Helper to create a relation object.
  function createRelation (type, product) {
    return {
      type,
      text: product.presskit.title,
      path: getAbsolutePageUrl(product.path, product.presskit)
    }
  }
}

async function exportAdditionalAssets () {
  showHeader('Exporting assets')

  // Copy assets (CSS and stuff)
  await copyMandatoryFiles()

  // Copy the selected CSS theme.
  await copyThemeCss()
}

// Print a console UI header text.
function showHeader (text) {
  console.log('')
  console.log(chalk.magenta(text + '…'))
}

// Add css and any mandatory files specified to the build directory
async function copyMandatoryFiles () {
  const buildDir = createAndGetBuildFolder()

  for (const f of assetsToCopy) {
    const filepath = path.resolve(f)

    // Get filename and dirname from the provided path.
    const filename = path.basename(filepath)
    const dirname = path.basename(path.dirname(filepath))

    // Create the directory for this file if needed.
    // ie. css/master.css needs a `css` directory.
    const targetDir = path.join(buildDir, dirname)
    sfs.createDir(targetDir)

    // And copy the file.
    const targetPath = path.join(targetDir, filename)

    console.log('- ' + targetPath)
    try {
      await writeFilePromised(targetPath, await readFilePromised(filepath))
    } catch (e) {
      const msg = chalk.dim(`(${e.message})`)
      console.error(`There was an error while copying ${chalk.bold(filename)}. ${msg}`)
    }
  }
}

// Resolve and copy the CSS theme to the build directory as light.css.
// If the value is a bare name (no path separator), resolve from the
// built-in css folder (e.g. "dark" → assets/css/dark.css).
// Otherwise, treat it as a file path.
async function copyThemeCss () {
  const css = config.commands.build.css || 'light'

  // Bare name (no slash) → built-in theme.
  const isBuiltIn = !css.includes('/') && !css.includes('\\')
  const filepath = isBuiltIn
    ? path.join(cssFolder, css.endsWith('.css') ? css : `${css}.css`)
    : path.resolve(css)

  if (!fs.existsSync(filepath)) {
    console.error(`CSS file not found: ${chalk.blue(filepath)}`)
    return
  }

  const buildDir = createAndGetBuildFolder()
  const targetDir = path.join(buildDir, 'css')
  sfs.createDir(targetDir)

  const targetPath = path.join(targetDir, 'theme.css')
  console.log('- ' + targetPath)

  try {
    await writeFilePromised(targetPath, await readFilePromised(filepath))
  } catch (e) {
    const msg = chalk.dim(`(${e.message})`)
    console.error(`There was an error while copying CSS theme. ${msg}`)
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
  const ext = path.extname(filename)
  const filenameWithoutExt = path.basename(filename, ext)

  return filenameWithoutExt === 'data' && ext === '.xml'
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
    fs.rmSync(path.join(createAndGetBuildFolder(), 'css'), { recursive: true, force: true })
    installDevelopmentWatcher(entryPoint, callback)
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
