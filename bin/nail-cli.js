#!/usr/bin/env node
const fs = require('fs')
const chalk = require('chalk')
const semver = require('semver')
const runServer = require('./dev-server')
const requiredVersion = require('../package.json').engines.node
const { ROOT, localResolve, appResolve, is } = require('../lib/env-global')
const configPath = appResolve('nail.config.js')

if (!semver.satisfies(process.version, requiredVersion)) {
  console.log(chalk.yellow(
    `You are using Node ${process.version}, but nail-cli ` +
    `requires Node ${requiredVersion}.\nPlease upgrade your Node version.`
  ))
  process.exit(1)
}

if (fs.existsSync(configPath)) {
  if (process.argv.includes('serve')) {
    const userConfig = require(configPath)
    runServer({
      ...require('../options')(),
      ...userConfig
    })
  }
} else {
  console.log(chalk.red('The configuration file "nail.config.js" does not exist.'))
}