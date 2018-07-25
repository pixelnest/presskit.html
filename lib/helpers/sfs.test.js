'use strict'

const mock = require('mock-fs')
const fs = require('fs')
const sfs = require('./sfs')

// -------------------------------------------------------------
// Data.
// -------------------------------------------------------------

let fakeFileSystem = {
  'product1': {
    'data.json': '{ "type": "product", "title": "Fake Product" }',
    'images': {
      'img01.png': Buffer.from([]),
      'img02.png': Buffer.from([]),
      'img03.png': Buffer.from([])
    },
    'emptyDir1': {}
  },
  'product2': {
    'data.xml': '<?xml version="1.0" encoding="utf-8"?><product></product>'
  },
  'misc': {
    'product3': {
      'data.md': 'Fake Product'
    },
    'emptyDir2': {}
  },
  'emptyDir3': {},
  'data.json': '{ "type": "company", "title": "Fake Company" }'
}

// -------------------------------------------------------------
// Setup.
// -------------------------------------------------------------

beforeEach(() => {
  mock(fakeFileSystem)
})

afterEach(() => {
  mock.restore()
})

// -------------------------------------------------------------
// Tests.
// -------------------------------------------------------------

describe('createDir()', () => {
  it('should create a directory if it does not exist', () => {
    // No dir: error.
    expect(() => fs.readdirSync('tmpdir')).toThrow()

    let result = sfs.createDir('tmpdir')
    expect(result).toBeTruthy()
    expect(fs.readdirSync('tmpdir').length).toBe([].length)
  })

  it('should not create the directory if it already exists', () => {
    let result = sfs.createDir('product1')
    expect(result).toBeFalsy()
  })
})

describe('copyDirContent()', () => {
  it('should copy all the files of a folder to another', () => {
    const numberOfFiles = fs.readdirSync('product1/images').length
    sfs.copyDirContent('product1/images', 'copiedImages')

    expect(fs.readdirSync('copiedImages').length).toBe(numberOfFiles)
  })
})

describe('findAllFiles()', () => {
  it('should return an array containing every files on the FS', () => {
    let files = sfs.findAllFiles('.')

    // Number of files in mockfs.
    expect(files.length).toBe(7)
  })

  it('should limit its search to one subfolder only', () => {
    let files = sfs.findAllFiles('.', { maxDepth: 1 })
    expect(files.length).toBe(3)
  })

  it('should ignore some folders', () => {
    let files = sfs.findAllFiles('.', { ignoredFolders: ['product1', 'product2'] })
    expect(files.length).toBe(2)
  })
})
