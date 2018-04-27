#!/usr/bin/env node
const chalk = require('chalk')
const execa = require('execa')
const semver = require('semver')
const jestTest = require('./jest')
const runBuild = require('./build')
const { config } = require('../env')
const runServer = require('./server')
const { log, removeLastSlash } = require('../utils')
const cypressBinPath = require.resolve('cypress/bin/cypress')
const requiredVersion = config.app.packageJson.engines.node

if (!semver.satisfies(process.version, requiredVersion)) {
  log.yellow(
    `You are using Node ${process.version}, but nail-cli ` +
    `requires Node ${requiredVersion}.\nPlease upgrade your Node version.`
  )
  process.exit(1)
}

const setProdEnv = stats => {
  const mode = stats ? 'production' : 'development'
  process.env.NODE_ENV = mode
  process.env.BABEL_ENV = mode
}

let finalConfig = {
  ...config.local.options,
  ...config.app.options
}

// process.traceDeprecation = true
process.noDeprecation = true

const argv = process.argv

if (argv.length === 0) {
  console.log(chalk.red('Please enter a valid command parameter.'))
} else if (argv.includes('serve')) {
  setProdEnv(false)
  runServer(finalConfig, true)
} else if (argv.includes('build')) {
  process.env.PUBLIC_URL = removeLastSlash(finalConfig.publicPath)
  setProdEnv(true)
  if (argv.includes('--preview')) {
    finalConfig.isAnalyze = false
    runServer(finalConfig, true)
  } else {
    runBuild(finalConfig)
  }
} else if (argv.includes('unit')) {
  jestTest(finalConfig.jestConfig, argv.slice(argv.indexOf('unit') + 1))
}  else if (argv.includes('e2e')) {
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
