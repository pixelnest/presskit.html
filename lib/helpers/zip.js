'use strict'

const fs = require('fs')
const path = require('upath')
const archiver = require('archiver')

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

function zip (name, destination, source, files) {
  if (files && files.length > 0) {
    const filename = path.join(destination, name)
    const output = fs.createWriteStream(filename)

    const archive = archiver('zip', { store: true })
    archive.on('error', (err) => { throw err })
    archive.pipe(output)

    files.forEach((f) => {
      archive.append(fs.createReadStream(path.join(source, f)), { name: f })
    })

    archive.finalize()

    return filename
  }
}

// -------------------------------------------------------------
// Exports.
// -------------------------------------------------------------

module.exports = zip
