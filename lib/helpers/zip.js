'use strict'

const fs = require('fs')
const path = require('upath')
const archiver = require('archiver')

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

// Create a zip archive of the files.
// Resolve with the archive path once it's fully written on disk.
function zip (name, destination, source, files) {
  if (!files || files.length === 0) return Promise.resolve()

  return new Promise((resolve, reject) => {
    const filename = path.join(destination, name)
    const output = fs.createWriteStream(filename)

    const archive = archiver('zip', { store: true })
    // Missing files are only warnings for archiver, but we don't want
    // to ship an incomplete archive.
    archive.on('warning', reject)
    archive.on('error', reject)
    output.on('error', reject)
    output.on('close', () => resolve(filename))
    archive.pipe(output)

    // `file` (unlike `append` with a stream) reports read errors
    // to the archive handlers above, so the promise can't hang.
    files.forEach((f) => {
      archive.file(path.join(source, f), { name: f })
    })

    archive.finalize()
  })
}

// -------------------------------------------------------------
// Exports.
// -------------------------------------------------------------

module.exports = zip
