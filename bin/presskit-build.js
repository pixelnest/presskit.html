'use strict'

const chalk = require('chalk')
const program = require('commander')
const presskit = require('../lib/index')

// -------------------------------------------------------------
// Constants.
// -------------------------------------------------------------

const version = require('../package.json').version

const usage = chalk.green('[options]') + ' ' + chalk.yellow('<entry point>')

const description = `Generate a presskit based on information found in \`data.xml\` files. The format and the ouput are (nearly) the same as ${chalk.blue('http://dopresskit.com/')}. However, this command will generate static HTML files.

  More information on ${chalk.blue('https://github.com/pixelnest/presskit.html#usage')}.`

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

program
  .version(version)
  .description(description)
  .usage(usage)
  .option('-o, --output [destination]', 'Output the build folder to the [destination]', process.cwd())
  .option('-w, --watch', 'Watch project for changes and re-generate if needed')
  .option('-d, --dev', 'Add monitoring of CSS and templates in watch mode')
  .option('-p, --port [8080]', 'Set the server port to [8080]', 8080)
  .option('-D, --clean-build-folder', 'Delete the build folder beforehand')
  .option('-L, --pretty-links', 'Hide index.html at the end of links')
  .parse(process.argv)

presskit.runBuildCommand({
  entryPoint: program.args[0],
  cleanBuildFolder: program.cleanBuildFolder,
  prettyLinks: program.prettyLinks,
  output: program.output,
  watch: program.watch,
  port: program.port,
  dev: program.dev
})
