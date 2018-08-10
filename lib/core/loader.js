'use strict'

const fs = require('fs')
const parser = require('./parser')

// -------------------------------------------------------------
// Constants.
// -------------------------------------------------------------

// The XML parser can't understand automatically that a list of
// XML children is an array.
//
// So it generates aberrations like:
//
//   "awards": {
//     "award": [
//       {"description": ""},
//       {"description": ""}
//     ]
//   }
//
// Moreover, if there's only one element, it will not put it in
// an array. ie., if there's one award in the array above, the result
// is going to be:
//
//   "awards": {
//     "award": {"description": ""}
//   }
//
// But we want an array every time.
//
// The keys below are the arrays that need to be normalized.
const keysToNormalize = [
  // Remember, we convert kebab-case to camelCase,
  // so release-dates is converted to releaseDates.
  'releaseDates',
  'partners',
  'platforms',
  'prices',
  'relations',
  'features',
  'socials',
  'histories',
  'trailers',
  'awards',
  'quotes',
  'additionals',
  'abouts',
  'credits',
  'contacts'
]

const tagsToClean = [
  '<br>',
  '<br />',
  '<br/>',
  '<hr>',
  '<hr />',
  '<hr/>',
  '<strong>',
  '</strong>',
  '<em>',
  '</em>',
  '<i>',
  '</i>',
  '<b>',
  '</b>'
]

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

function loadDataFile (filename) {
  let xml = fs.readFileSync(filename, 'utf-8')

  // Remove inline tags.
  xml = cleanTokens(tagsToClean, xml)

  const rawJSON = parser.parseXML(xml)

  // Normalize some keys.
  return normalizeKeys(keysToNormalize, rawJSON)
}

function cleanTokens (tokens, str) {
  const regex = new RegExp(tokens.join('|'), 'gi')
  return str.replace(regex, '')
}

// TODO: this should probably be done as a custom tag processor with xml2js.
function normalizeKeys (keys, json) {
  Object.keys(json)
    .filter(k => keys.includes(k))
    .forEach(k => {
      json[k] = normalize(json[k])
    })

  return json
}

function normalize (obj) {
  const keys = Object.keys(obj)

  // Ignore if there're more than one key or 0 in the object.
  if (keys.length === 0 || keys.length > 1) return obj

  // Get the content of the only key of the object.
  const data = obj[keys[0]]

  // An array? Return it.
  if (Array.isArray(data)) {
    return data
  }

  // Otherwise, wrap in an array.
  return [data]
}

// -------------------------------------------------------------
// Exports.
// -------------------------------------------------------------

module.exports = {
  loadDataFile,

  __cleanTokens: cleanTokens,
  __normalizeKeys: normalizeKeys,
  __normalize: normalize
}
