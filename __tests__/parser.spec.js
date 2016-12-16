'use strict'

// -------------------------------------------------------------
// Imports.
// -------------------------------------------------------------

const fs = require('fs')

const samples = require('./samples')
const parser = require('../lib/parser')

// -------------------------------------------------------------
// XML.
// -------------------------------------------------------------

describe('XML Parser', () => {
  it('handles undefined XML strings', () => {
    parser.parseXML(undefined, (err, data) => {
      expect(err).toBeDefined()
      expect(data).toBeUndefined()
    })
  })

  it('handles null XML strings', () => {
    parser.parseXML(null, (err, data) => {
      expect(err).toBeDefined()
      expect(data).toBeUndefined()
    })
  })

  it('handles empty XML strings', () => {
    parser.parseXML('', (err, data) => {
      expect(err).toBeDefined()
      expect(data).toBeUndefined()
    })
  })

  it('handles invalid XML strings', () => {
    parser.parseXML('Test. This is not XML', (err, data) => {
      expect(err).toBeDefined()
      expect(data).toBeUndefined()
    })
  })

  it('handles incompleted XML strings', () => {
    let data = '<?xml version="1.0"?><catalog><book id="bk101"><author>Gambardella, Matthew'

    parser.parseXML(data, (err, data) => {
      expect(err).toBeDefined()
      expect(data).toBeUndefined()
    })
  })

  it('handles valid XML strings but invalid presskit data', () => {
    let data = '<?xml version="1.0"?><catalog><book id="bk101"><author>Gambardella, Matthew</author><title>XML Developer\'s Guide</title><genre>Computer</genre><price>44.95</price><publish_date>2000-10-01</publish_date><description>An in-depth look at creating applications with XML.</description></book></catalog>'

    parser.parseXML(data, (err, data) => {
      expect(data).toBeUndefined()
      expect(err).toBeDefined()
    })
  })

  it('handles valid XML company presskit string', () => {
    parser.parseXML(samples.companyXML, (err, data) => {
      expect(err).toBeNull()
      expect(data.type).toBe('company')
      expect(data.title).toBeDefined()
      expect(data.description).toBeDefined()
    })
  })

  it('handles valid XML game presskit string', () => {
    parser.parseXML(samples.productXML, (err, data) => {
      expect(err).toBeNull()
      expect(data.type).toBe('product')
      expect(data.title).toBeDefined()
      expect(data.description).toBeDefined()
    })
  })
})

// -------------------------------------------------------------
// JSON.
// -------------------------------------------------------------

describe('JSON Parser', () => {
  let companyJSON = fs.readFileSync('./docs/data/company/data.json', 'utf-8')
  let productJSON = fs.readFileSync('./docs/data/product/data.json', 'utf-8')

  it('handles undefined JSON strings', () => {
    parser.parseJSON(undefined, (err, data) => {
      expect(err).toBeDefined()
      expect(data).toBeUndefined()
    })
  })

  it('handles null JSON strings', () => {
    parser.parseJSON(null, (err, data) => {
      expect(err).toBeDefined()
      expect(data).toBeUndefined()
    })
  })

  it('handles empty JSON strings', () => {
    parser.parseJSON('', (err, data) => {
      expect(err).toBeDefined()
      expect(data).toBeUndefined()
    })
  })

  it('handles invalid JSON strings', () => {
    parser.parseJSON('Test. This is not JSON', (err, data) => {
      expect(err).toBeDefined()
      expect(data).toBeUndefined()
    })
  })

  it('handles incompleted JSON strings', () => {
    parser.parseJSON('{ "game" : { "title": "My Super Game!!"', (err, data) => {
      expect(err).toBeDefined()
      expect(data).toBeUndefined()
    })
  })

  it('handles valid JSON strings but invalid presskit data', () => {
    let data = '{"employees":[{"firstName":"John","lastName":"Doe"},{"firstName":"Anna","lastName":"Smith"},{"firstName":"Peter","lastName":"Jones"}]}'

    parser.parseJSON(data, (err, data) => {
      expect(data).toBeUndefined()
      expect(err).toBeDefined()
    })
  })

  it('handles valid JSON company presskit string', () => {
    parser.parseJSON(companyJSON, (err, data) => {
      expect(err).toBeNull()
      expect(data.type).toBe('company')
      expect(data.title).toBeDefined()
    })
  })

  it('handles valid JSON game presskit string', () => {
    parser.parseJSON(productJSON, (err, data) => {
      expect(err).toBeNull()
      expect(data.type).toBe('product')
      expect(data.title).toBeDefined()
    })
  })
})
