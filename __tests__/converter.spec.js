'use strict'
const converter = require('../lib/converter')

it('handles undefined XML strings', () => {
  converter.convert(undefined, function (err, data) {
    expect(err).toBeDefined()
    expect(data).toBeUndefined()
  })
})

it('handles null XML strings', () => {
  converter.convert(null, function (err, data) {
    expect(err).toBeDefined()
    expect(data).toBeUndefined()
  })
})

it('handles empty XML strings', () => {
  converter.convert('', function (err, data) {
    expect(err).toBeDefined()
    expect(data).toBeUndefined()
  })
})

it('handles invalid XML strings', () => {
  converter.convert('Test. This is not XML', function (err, data) {
    expect(err).toBeDefined()
    expect(data).toBeUndefined()
  })
})

it('handles incompleted XML strings', () => {
  converter.convert('<todo>', function (err, data) {
    expect(err).toBeDefined()
    expect(data).toBeUndefined()
  })
})

it('handles valid XML strings but invalid presskit data', () => {
})

it('handles valid XML presskit string', () => {
})
