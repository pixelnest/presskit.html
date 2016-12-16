'use strict'

// -------------------------------------------------------------
// Imports.
// -------------------------------------------------------------

const mock = require('mock-fs')
const fs = require('fs')
const sfs = require('../lib/helpers/sfs')

// -------------------------------------------------------------
// Data.
// -------------------------------------------------------------

let fakeFileSystem = {
  'product1': {
    'data.json': '{ "type": "product", "title": "Fake Product" }',
    'images': {
      'img01.png': new Buffer([]),
      'img02.png': new Buffer([]),
      'img03.png': new Buffer([])
    },
    'empty': {}
  },
  'product2': {
    'data.xml': '<?xml version="1.0" encoding="utf-8"?><product></product>'
  },
  'misc': {
    'test': {}
  },
  'other': {},
  'data.json': '{ "type": "company", "title": "Fake Company" }'
}

// -------------------------------------------------------------
// Setup.
// -------------------------------------------------------------

beforeAll(() => {
  mock(fakeFileSystem)
})

afterAll(() => {
  mock.restore()
})

// -------------------------------------------------------------
// Spec.
// -------------------------------------------------------------

describe('#createDir', () => {
  it('should create a directory if it does not exist', () => {
    // No dir: error.
    expect(() => fs.readdirSync('tmpdir')).toThrow()

    let result = sfs.createDir('tmpdir')
    expect(result).toBeTruthy()
    expect(fs.readdirSync('tmpdir').length).toBe([].length)
  })

  it('should not create the directory if it already exists', () => {
    let result = sfs.createDir('other')
    expect(result).toBeFalsy()
  })
})
