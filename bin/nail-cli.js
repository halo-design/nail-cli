#!/usr/bin/env node
const fs = require('fs')
const chalk = require('chalk')
const semver = require('semver')
const runBuild = require('./build')
const runServer = require('./dev-server')
const buildServer = require('./build-server')
const { removeLastSlash } = require('../lib/utils')
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

let finalConfig = require('../options')()

if (fs.existsSync(configPath)) {
  finalConfig = {
    ...finalConfig,
    ...require(configPath)
  }
} else {
  console.log(chalk.cyan('The configuration file "nail.config.js" does not exist.'))
}

// process.traceDeprecation = true
process.noDeprecation = true

if (process.argv.includes('serve')) {
  process.env.NODE_ENV = process.env.BABEL_ENV = 'development'
  runServer(finalConfig)
} else if (process.argv.includes('build')) {
  process.env.PUBLIC_URL = removeLastSlash(finalConfig.publicPath)
  process.env.NODE_ENV = process.env.BABEL_ENV = 'production'
  if (process.argv.includes('--preview')) {
    buildServer(finalConfig)
  } else {
    runBuild(finalConfig)
  }
}