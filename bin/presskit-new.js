'use strict'

const chalk = require('chalk')
const program = require('commander')
const presskit = require('../lib/index')

// -------------------------------------------------------------
// Constants.
// -------------------------------------------------------------

const version = require('../package.json').version

const usage = chalk.green('[options]') + ' ' + chalk.yellow('<destination>')

const description = `Create an empty \`data.xml\` file and its \`images/\` folder in the <destination> folder (current working directory by default).

  There are two template types available: ${chalk.blue('company')} (default) or ${chalk.blue('product')}.`

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

program
  .version(version)
  .description(description)
  .usage(usage)
  .option('-t, --type [company]', 'set the type of the new `data.xml` file', 'company')
  .parse(process.argv)

presskit.runNewCommand(program.type, program.args[0] || process.cwd())
