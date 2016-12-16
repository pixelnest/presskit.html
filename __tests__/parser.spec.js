'use strict'

const samples = require('./samples')
const parser = require('../lib/parser')

// XML tests
// ----------------------------------------------------------------------------------------

it('handles undefined XML strings', () => {
  parser.parseXML(undefined, function (err, data) {
    expect(err).toBeDefined()
    expect(data).toBeUndefined()
  })
})

it('handles null XML strings', () => {
  parser.parseXML(null, function (err, data) {
    expect(err).toBeDefined()
    expect(data).toBeUndefined()
  })
})

it('handles empty XML strings', () => {
  parser.parseXML('', function (err, data) {
    expect(err).toBeDefined()
    expect(data).toBeUndefined()
  })
})

it('handles invalid XML strings', () => {
  parser.parseXML('Test. This is not XML', function (err, data) {
    expect(err).toBeDefined()
    expect(data).toBeUndefined()
  })
})

it('handles incompleted XML strings', () => {
  parser.parseXML('<?xml version="1.0"?><catalog><book id="bk101"><author>Gambardella, Matthew'
  , function (err, data) {
    expect(err).toBeDefined()
    expect(data).toBeUndefined()
  })
})

it('handles valid XML strings but invalid presskit data', () => {
  parser.parseXML('<?xml version="1.0"?><catalog><book id="bk101"><author>Gambardella, Matthew</author><title>XML Developer\'s Guide</title><genre>Computer</genre><price>44.95</price><publish_date>2000-10-01</publish_date><description>An in-depth look at creating applications with XML.</description></book></catalog>'
  , function (err, data) {
    expect(data).toBeUndefined()
    expect(err).toBeDefined()
  })
})

it('handles valid XML company presskit string', () => {
  parser.parseXML(samples.companyXML, function (err, data) {
    expect(err).toBeNull()
    expect(data.type).toBe('company')
    expect(data.title).toBeDefined()
    expect(data.description).toBeDefined()
  })
})

it('handles valid XML game presskit string', () => {
  parser.parseXML(samples.productXML, function (err, data) {
    expect(err).toBeNull()
    expect(data.type).toBe('product')
    expect(data.title).toBeDefined()
    expect(data.description).toBeDefined()
  })
})

// JSON tests
// ----------------------------------------------------------------------------------------

it('handles undefined JSON strings', () => {
  parser.parseJSON(undefined, function (err, data) {
    expect(err).toBeDefined()
    expect(data).toBeUndefined()
  })
})

it('handles null JSON strings', () => {
  parser.parseJSON(null, function (err, data) {
    expect(err).toBeDefined()
    expect(data).toBeUndefined()
  })
})

it('handles empty JSON strings', () => {
  parser.parseJSON('', function (err, data) {
    expect(err).toBeDefined()
    expect(data).toBeUndefined()
  })
})

it('handles invalid JSON strings', () => {
  parser.parseJSON('Test. This is not JSON', function (err, data) {
    expect(err).toBeDefined()
    expect(data).toBeUndefined()
  })
})

it('handles incompleted JSON strings', () => {
  parser.parseJSON('{ "game" : { "title": "My Super Game!!"'
  , function (err, data) {
    expect(err).toBeDefined()
    expect(data).toBeUndefined()
  })
})

it('handles valid JSON strings but invalid presskit data', () => {
  parser.parseJSON('{"employees":[{"firstName":"John","lastName":"Doe"},{"firstName":"Anna","lastName":"Smith"},{"firstName":"Peter","lastName":"Jones"}]}'
  , function (err, data) {
    expect(data).toBeUndefined()
    expect(err).toBeDefined()
  })
})

it('handles valid JSON company presskit string', () => {
  parser.parseJSON(samples.companyJSON, function (err, data) {
    expect(err).toBeNull()
    expect(data.type).toBe('company')
    expect(data.title).toBeDefined()
  })
})

it('handles valid JSON game presskit string', () => {
  parser.parseJSON(samples.productJSON, function (err, data) {
    expect(err).toBeNull()
    expect(data.type).toBe('product')
    expect(data.title).toBeDefined()
  })
})
