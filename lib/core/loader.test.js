'use strict'

const {
  __normalizeKeys: normalizeKeys,
  __normalize: normalize,
  __cleanTokens: cleanTokens
} = require('./loader')

// -------------------------------------------------------------
// Tests.
// -------------------------------------------------------------

describe('cleanTokens()', () => {
  const tokens = [
    '<br>',
    '<br/>',
    '<br />',
    '<strong>',
    '</strong>',
    '<em>',
    '</em>'
  ]

  it('should not change a string without tokens', () => {
    expect(cleanTokens(tokens, 'test test test')).toEqual('test test test')
  })

  it('should remove all tokens', () => {
    expect(cleanTokens(tokens, '<br>This <strong>is</strong> a<br/> <em>string</em>'))
      .toEqual('This is a string')
  })

  it('should remove all tokens with multiline string', () => {
    const start = `
      <br>This <strong>is</strong> a<br/> <em>string</em>
      Yep, it is.<br /><br />
    `

    const result = `
      This is a string
      Yep, it is.
    `

    expect(cleanTokens(tokens, start)).toEqual(result)
  })
})

describe('normalizeKeys()', () => {
  const keys = ['quotes', 'awards']
  const received = {
    'quotes': {
      'quote': {'description': 'quote'}
    },
    'awards': {
      'award': [
        {'description': 1},
        {'description': 2}
      ]
    },
    'test': 42,
    'socials': {
      'social': [
        {'text': 1},
        {'text': 2}
      ]
    }
  }
  const correct = {
    'quotes': [{'description': 'quote'}],
    'awards': [
      {'description': 1},
      {'description': 2}
    ],
    'test': 42,
    'socials': {
      'social': [
        {'text': 1},
        {'text': 2}
      ]
    }
  }

  it('normalizes a list of provided keys in an object', () => {
    expect(normalizeKeys(keys, received)).toEqual(correct)
  })
})

describe('normalize()', () => {
  it('returns the correct content as it is', () => {
    expect(normalize([
      {'description': 1},
      {'description': 2}
    ])).toEqual([
      {'description': 1},
      {'description': 2}
    ])
  })

  it('returns an object without the useless intermediate key', () => {
    expect(normalize({
      'award': [
        {'description': 1},
        {'description': 2}
      ]
    })).toEqual([
      {'description': 1},
      {'description': 2}
    ])
  })

  it('returns an object containing an array, even if there is one item only', () => {
    expect(normalize({
      'award': {'description': 1}
    })).toEqual([
      {'description': 1}
    ])
  })

  it('ignores an object containing 0 key', () => {
    expect(normalize({})).toEqual({})
  })

  it('ignores an object containing 2 keys or more', () => {
    expect(normalize({
      'test': true,
      'award': [
        {'description': 1},
        {'description': 2}
      ]
    })).toEqual({
      'test': true,
      'award': [
        {'description': 1},
        {'description': 2}
      ]
    })
  })
})
