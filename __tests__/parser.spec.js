'use strict'

// -------------------------------------------------------------
// Imports.
// -------------------------------------------------------------

const fs = require('fs')

const parser = require('../lib/core/parser')

// -------------------------------------------------------------
// XML.
// -------------------------------------------------------------

describe('XML Parser', () => {
  let companyXML = fs.readFileSync('./docs/data/company/data.xml', 'utf-8')
  let productXML = fs.readFileSync('./docs/data/product/data.xml', 'utf-8')

  it('handles empty, null or undefined XML strings', () => {
    expect(() => parser.parseXML(undefined)).toThrow()
    expect(() => parser.parseXML(null)).toThrow()
    expect(() => parser.parseXML('')).toThrow()
  })

  it('handles invalid XML strings', () => {
    expect(() => parser.parseXML('Test. This is not XML')).toThrow()
  })

  it('handles incomplete XML strings', () => {
    let data = '<?xml version="1.0"?><catalog><book id="bk101"><author>Gambardella, Matthew'

    expect(() => parser.parseXML(data)).toThrow()
  })

  it('handles valid XML strings but invalid presskit data', () => {
    let data = '<?xml version="1.0"?><catalog><book id="bk101"><author>Gambardella, Matthew</author><title>XML Developer\'s Guide</title><genre>Computer</genre><price>44.95</price><publish_date>2000-10-01</publish_date><description>An in-depth look at creating applications with XML.</description></book></catalog>'

    expect(() => parser.parseXML(data)).toThrow()
  })

  it('handles valid XML `company` presskit string', () => {
    let result = parser.parseXML(companyXML)

    expect(result.type).toBe('company')
    expect(result.title).toBeDefined()
    expect(result.description).toBeDefined()
  })

  it('handles valid XML `product` or `game` presskit string', () => {
    let result = parser.parseXML(productXML)

    expect(result.type).toBe('product')
    expect(result.title).toBeDefined()
    expect(result.description).toBeDefined()
  })
})

// -------------------------------------------------------------
// JSON.
// -------------------------------------------------------------

describe('JSON Parser', () => {
  let companyJSON = fs.readFileSync('./docs/data/company/data.json', 'utf-8')
  let productJSON = fs.readFileSync('./docs/data/product/data.json', 'utf-8')

  it('handles empty, null or undefined JSON strings', () => {
    expect(() => parser.parseJSON(undefined)).toThrow()
    expect(() => parser.parseJSON(null)).toThrow()
    expect(() => parser.parseJSON('')).toThrow()
  })

  it('handles invalid JSON strings', () => {
    expect(() => parser.parseJSON('Test. This is not JSON')).toThrow()
  })

  it('handles incomplete JSON strings', () => {
    expect(() => parser.parseJSON('{ "game" : { "title": "My Super Game!!"')).toThrow()
  })

  it('handles valid JSON strings but invalid presskit data', () => {
    let data = '{"employees":[{"firstName":"John","lastName":"Doe"},{"firstName":"Anna","lastName":"Smith"},{"firstName":"Peter","lastName":"Jones"}]}'

    expect(() => parser.parseJSON(data)).toThrow()
  })

  it('handles valid JSON `company` presskit string', () => {
    let result = parser.parseJSON(companyJSON)

    expect(result.type).toBe('company')
    expect(result.title).toBeDefined()
  })

  it('handles valid JSON `product` or `game` presskit string', () => {
    let result = parser.parseJSON(productJSON)

    expect(result.type).toBe('product')
    expect(result.title).toBeDefined()
  })
})
