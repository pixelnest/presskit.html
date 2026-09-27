'use strict'

const fs = require('fs')
const path = require('path')
const os = require('os')
const zip = require('./zip')

// -------------------------------------------------------------
// Tests.
// -------------------------------------------------------------

describe('zip()', () => {
  let tempDir

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'presskit-zip-'))
    fs.writeFileSync(path.join(tempDir, 'a.jpg'), 'a')
    fs.writeFileSync(path.join(tempDir, 'b.jpg'), 'b')
  })

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true })
  })

  it('should resolve once the archive is fully written', async () => {
    const filename = await zip('images.zip', tempDir, tempDir, ['a.jpg', 'b.jpg'])

    // A complete zip ends with the "end of central directory" record.
    const archive = fs.readFileSync(filename)
    expect(archive.lastIndexOf(Buffer.from('PK\x05\x06'))).toBeGreaterThan(0)
  })

  it('should do nothing without files', async () => {
    expect(await zip('images.zip', tempDir, tempDir, [])).toBeUndefined()
    expect(fs.existsSync(path.join(tempDir, 'images.zip'))).toBe(false)
  })

  it('should reject when a file cannot be read', async () => {
    await expect(zip('images.zip', tempDir, tempDir, ['missing.jpg'])).rejects.toThrow()
  })
})
