'use strict'

const fs = require('fs')
const path = require('path')

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

// Create a directory if it doesn't exist yet.
function createDir (dir) {
  if (fs.existsSync(dir)) {
    return false
  }

  fs.mkdirSync(dir)
  return true
}

// Find all files in a directory structure.
function findAllFiles (baseDir, {
  ignoredFolders = [],
  maxDepth = undefined
} = {}) {
  let list = []

  function search (dir, depth) {
    fs.readdirSync(dir).forEach(file => {
      file = path.join(dir, file)

      // File or directory? Ok.
      // Otherwise, discard the file.
      let stat = fs.statSync(file)
      if (stat.isFile()) {
        list.push(file)
      } else if (stat.isDirectory()) {
        // The directory should be ignored?
        if (ignoredFolders.includes(path.basename(file))) {
          return
        }

        // Should we stop at this depth?
        if (maxDepth && (depth >= maxDepth)) {
          return
        }

        search(file, depth + 1)
      }
    })
  }

  search(baseDir, 0)

  return list
}

// -------------------------------------------------------------
// Exports.
// -------------------------------------------------------------

module.exports = {
  createDir,
  findAllFiles
}
