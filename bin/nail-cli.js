#!/usr/bin/env node
const fs = require('fs')
const chalk = require('chalk')
const execa = require('execa')
const semver = require('semver')
const runBuild = require('./build')
const jestTest = require('./jest-test')
const runServer = require('./dev-server')
const buildServer = require('./build-server')
const { removeLastSlash } = require('../lib/utils')
const cypressBinPath = require.resolve('cypress/bin/cypress')
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

const setProdEnv = stats => {
  const mode = stats ? 'production' : 'development'
  process.env.NODE_ENV = mode
  process.env.BABEL_ENV = mode
}

let finalConfig = require('../options')()

if (fs.existsSync(configPath)) {
  finalConfig = {
    ...finalConfig,
    ...require(configPath)
  }
} else {
  console.log(chalk.cyan('The configuration file "nail.config.js" does not exist.\n'))
}

// process.traceDeprecation = true
process.noDeprecation = true

const argv = process.argv

if (argv.length === 0) {
  console.log(chalk.red('Please enter a valid command parameter.'))
} else if (argv.includes('serve')) {
  setProdEnv(false)
  runServer(finalConfig)
} else if (argv.includes('build')) {
  process.env.PUBLIC_URL = removeLastSlash(finalConfig.publicPath)
  setProdEnv(true)
  argv.includes('--preview')
    ? buildServer(finalConfig)
    : runBuild(finalConfig)
} else if (argv.includes('unit')) {
  jestTest(finalConfig.jestConfig, argv.slice(argv.indexOf('unit') + 1))
} else if (argv.includes('e2e')) {
  const isProd = argv.includes('--production')
  const isOpen = argv.includes('--open')
  const port = isProd ? finalConfig.buildServerPort : finalConfig.devServerPort
  let cyArgv = ['--config', `baseUrl=http://localhost:${port}/`]
  cyArgv = [isOpen ? 'open' : 'run'].concat(cyArgv)

  finalConfig.autoOpenBrowser = false
  finalConfig.callback = stats => {
    execa(cypressBinPath, cyArgv, { stdio: 'inherit' })
  }

  if (isProd) {
    setProdEnv(true)
    buildServer(finalConfig)
  } else {
    setProdEnv(false)
    runServer(finalConfig)
  }
}
