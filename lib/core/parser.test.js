'use strict'

const fs = require('fs')

const parser = require('./parser')

// -------------------------------------------------------------
// Tests.
// -------------------------------------------------------------

describe('XML Parser', () => {
  let companyXML = fs.readFileSync(`${process.cwd()}/data/data.xml`, 'utf-8')
  let productXML = fs.readFileSync(`${process.cwd()}/data/product/data.xml`, 'utf-8')

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
