'use strict'

const fs = require('fs')
const path = require('path')
const os = require('os')

const generator = require('./generator')
const config = require('../config')

// -------------------------------------------------------------
// Helpers.
// -------------------------------------------------------------

function createTempDir () {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'presskit-test-'))
}

function writeXML (dir, xml) {
  fs.writeFileSync(path.join(dir, 'data.xml'), xml)
}

function setupConfig (outputDir) {
  config.commands.build = {
    output: outputDir,
    ignoreThumbnails: true,
    baseUrl: '/',
    prettyLinks: false,
    hamburger: false
  }
}

const companyXML = `<?xml version="1.0" encoding="utf-8"?>
<company>
  <title>Test Studio</title>
  <based-in>Paris</based-in>
  <founding-date>2020</founding-date>
  <website>https://example.com</website>
  <press-contact>press@example.com</press-contact>
  <description>A test studio.</description>
  <credits>
    <credit>
      <person>Test Person</person>
      <role>Developer</role>
    </credit>
  </credits>
</company>`

const gameXML = `<?xml version="1.0" encoding="utf-8"?>
<game>
  <title>Test Game</title>
  <website>https://example.com/game</website>
  <description>A test game.</description>
  <credits>
    <credit>
      <person>Test Person</person>
      <role>Developer</role>
    </credit>
  </credits>
</game>`

const productXML = `<?xml version="1.0" encoding="utf-8"?>
<product>
  <title>Test Product</title>
  <website>https://example.com/product</website>
  <description>A test product.</description>
  <credits>
    <credit>
      <person>Test Person</person>
      <role>Developer</role>
    </credit>
  </credits>
</product>`

// -------------------------------------------------------------
// Tests.
// -------------------------------------------------------------

describe('generate()', () => {
  let tempDir
  let buildDir

  beforeEach(() => {
    tempDir = createTempDir()
    buildDir = path.join(tempDir, 'build')
    setupConfig(buildDir)
  })

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true })
  })

  it('should build a company page', async () => {
    writeXML(tempDir, companyXML)
    await generator.generate(tempDir)

    expect(fs.existsSync(path.join(buildDir, 'index.html'))).toBe(true)
  })

  it('should build a company with a product', async () => {
    writeXML(tempDir, companyXML)

    const productDir = path.join(tempDir, 'mygame')
    fs.mkdirSync(productDir)
    writeXML(productDir, productXML)

    await generator.generate(tempDir)

    expect(fs.existsSync(path.join(buildDir, 'index.html'))).toBe(true)
    expect(fs.existsSync(path.join(buildDir, 'mygame', 'index.html'))).toBe(true)
  })

  it('should build a standalone game without a company', async () => {
    writeXML(tempDir, gameXML)
    await generator.generate(tempDir)

    expect(fs.existsSync(path.join(buildDir, 'index.html'))).toBe(true)
  })

  it('should build a standalone product without a company', async () => {
    writeXML(tempDir, productXML)
    await generator.generate(tempDir)

    expect(fs.existsSync(path.join(buildDir, 'index.html'))).toBe(true)
  })

  it('should not crash with no data files', async () => {
    await generator.generate(tempDir)

    expect(fs.existsSync(buildDir)).toBe(false)
  })

  it('should include company info in product page when company exists', async () => {
    writeXML(tempDir, companyXML)

    const productDir = path.join(tempDir, 'mygame')
    fs.mkdirSync(productDir)
    writeXML(productDir, productXML)

    await generator.generate(tempDir)

    const html = fs.readFileSync(path.join(buildDir, 'mygame', 'index.html'), 'utf-8')
    expect(html).toContain('Test Studio')
  })

  it('should not include company section in standalone game page', async () => {
    writeXML(tempDir, gameXML)
    await generator.generate(tempDir)

    const html = fs.readFileSync(path.join(buildDir, 'index.html'), 'utf-8')
    expect(html).not.toContain('About </h2>')
  })
})
