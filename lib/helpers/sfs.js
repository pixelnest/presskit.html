'use strict'

const fs = require('fs')
const path = require('path')

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

/**
 * Create a directory if it doesn't exist yet.
 * @param {string} dir - The path of the directory to create.
 * @returns {boolean} - true if a directory has been created, false otherwise.
 */
function createDir (dir) {
  if (fs.existsSync(dir)) {
    return false
  }

  fs.mkdirSync(dir)
  return true
}

/**
 * Find all files in a directory structure.
 * @param {string} baseDir - The base directory to search in.
 * @param {Object}
 * @returns {Array} The list of files.
 */
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
