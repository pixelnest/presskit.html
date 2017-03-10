'use strict'

const chalk = require('chalk')
const program = require('commander')
const presskit = require('../lib/index')

// -------------------------------------------------------------
// Constants.
// -------------------------------------------------------------

const version = require('../package.json').version

const usage = chalk.green('[options]') + ' ' + chalk.yellow('<entry point>')

const description = `Generate a "Presskit" based on information found in data.xml files. The format and the ouput are (nearly) the same as ${chalk.blue('http://dopresskit.com/')} by Rami Ismail (http://vlambeer.com). However, this command will generate static HTML files.

  More information on ${chalk.blue('https://github.com/pixelnest/presskit.html')}`

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

program
  .version(version)
  .description(description)
  .usage(usage)
  .option('-o, --output [destination]', 'Output the build folder to the [destination]', process.cwd())
  .option('-w, --watch', 'Watch project for changes and re-generate if needed')
  .parse(process.argv)

presskit.runBuildCommand({
  entryPoint: program.args[0],
  output: program.output,
  watch: program.watch
})
