'use strict'

const fs = require('fs')
const fse = require('fs-extra')
const path = require('upath')
// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

// Create a directory if it doesn't exist yet.
function createDir (dir) {
  if (fs.existsSync(dir)) {
    return false
  }

  fs.mkdirSync(dir, { recursive: true })
  return true
}

function copyDirContent (source, target) {
  if (!fs.existsSync(source)) return

  // Create target dir if necessary.
  createDir(target)

  // Copy all files from source to target.
  findAllFiles(source).forEach((name) => {
    const nameWithoutSource = path.relative(source, name)
    const targetFile = path.join(target, nameWithoutSource)
    fse.outputFileSync(targetFile, fs.readFileSync(name))
  })
}

// Find all files in a directory structure.
function findAllFiles (baseDir, {
  ignoredFolders = [],
  maxDepth = undefined
} = {}) {
  const list = []

  function search (dir, depth) {
    let entries
    try {
      entries = fs.readdirSync(dir)
    } catch (e) {
      return
    }

    entries.forEach(file => {
      file = path.join(dir, file)

      // File or directory? Ok.
      // Otherwise, discard the file (may have been deleted between readdir and stat).
      let stat
      try {
        stat = fs.statSync(file)
      } catch (e) {
        return
      }

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
  copyDirContent,
  findAllFiles
}
