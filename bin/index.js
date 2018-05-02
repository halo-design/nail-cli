#!/usr/bin/env node
const chalk = require('chalk')
const execa = require('execa')
const semver = require('semver')
const jestTest = require('./jest')
const runBuild = require('./build')
const program = require('commander')
const runServer = require('./server')
const { log, removeLastSlash } = require('../utils')
const { protocol, config: { app, local } } = require('../env')
const cypressBinPath = require.resolve('cypress/bin/cypress')
const requiredVersion = app.packageJson.engines.node

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
  ...local.options,
  ...app.options
}

// process.traceDeprecation = true
process.noDeprecation = true

program
  .version(app.packageJson.version, '-v, --version')
  .command('serve')
  .option('-o --open', 'Development mode launches local services')
  .option('-p --production', 'Production mode launches local services')
  .action(cmd => {
    if (cmd.open) {
      finalConfig.autoOpenBrowser = true
    }
    if (cmd.production) {
      setProdEnv(true)
      finalConfig.isAnalyze = false
      runServer(finalConfig, false)
    } else {
      setProdEnv(false)
      runServer(finalConfig, true)
    }
  })

program
  .command('build')
  .option('-a --analyze', 'Generate the packaging analysis report')
  .action(cmd => {
    process.env.PUBLIC_URL = removeLastSlash(finalConfig.publicPath)
    setProdEnv(true)
    if (cmd.analyze) {
      finalConfig.isAnalyze = true
    }
    runBuild(finalConfig)
  })

program
  .command('unit')
  .option('-c --coverage', 'Generate test coverage reports')
  .action(cmd => {
    let argv = cmd.coverage ? ['--coverage'] : []
    jestTest(finalConfig.jestConfig, argv)
  })

program
  .command('e2e')
  .option('-o --open', 'Open cypress for testing')
  .action(cmd => {
    let cyArgv = ['--config', `baseUrl=${protocol}://localhost:${finalConfig.devServerPort}/`]
    cyArgv = [cmd.open ? 'open' : 'run'].concat(cyArgv)

    finalConfig.autoOpenBrowser = false
    finalConfig.callback = stats => {
      execa(cypressBinPath, cyArgv, { stdio: 'inherit' })
    }

    setProdEnv(false)
    runServer(finalConfig, true)
  })
  
program.parse(process.argv)
