'use strict'

const fs = require('fs')
const fse = require('fs-extra')
const path = require('upath')
const mkdirp = require('mkdirp')

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

// Create a directory if it doesn't exist yet.
function createDir (dir) {
  if (fs.existsSync(dir)) {
    return false
  }

  mkdirp.sync(dir)
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
  copyDirContent,
  findAllFiles
}
