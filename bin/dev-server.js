const fs = require('fs')
const chalk = require('chalk')
const webpack = require('webpack')
const devConfigGenerator = require('../config/webpack.dev.config')
const devServerConfig = require('../config/devServer.config')
const { appResolve } = require('../lib/env-global')
const WebpackDevServer = require('webpack-dev-server')
const openBrowser = require('react-dev-utils/openBrowser')
const { choosePort, prepareUrls, createCompiler, prepareProxy } = require('react-dev-utils/WebpackDevServerUtils')
const pkg = require(appResolve('package.json'))

const runServer = ({
  entry,
  template,
  env,
  proxyTable,
  serverPort
}) => {
const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
const SET_HOST = process.env.HOST || '0.0.0.0'
const SET_PORT = parseInt(process.env.PORT, 10) || serverPort

const useYarn = fs.existsSync(appResolve('yarn.lock'))

const devConfig = devConfigGenerator(entry, template, env)

choosePort(SET_HOST, SET_PORT)
  .then(port => {
    if (!port) {
      console.log(chalk.yellow('We have not found a port!'))
      return
    }
    const urls = prepareUrls(protocol, SET_HOST, port)
    const compiler = createCompiler(webpack, devConfig, pkg.name, urls, useYarn)
    const proxyConfig = prepareProxy(proxyTable, appResolve('public'))
    const devServer = new WebpackDevServer(compiler, devServerConfig(
      devConfig.output.publicPath,
      proxyConfig,
      urls.lanUrlForConfig
    ))

    devServer.listen(port, SET_HOST, err => {
      if (err) {
        return console.log(chalk.red(err))
      }
      console.log(chalk.cyan('Starting the development server...\n'))
      openBrowser(urls.localUrlForBrowser)
    })

    ;['SIGINT', 'SIGTERM'].forEach(signal => {
      process.on(signal, () => {
        devServer.close(() => {
          process.exit(0)
        })
      })
    })
  })
  .catch(err => {
    if (err && err.message) {
      console.log(chalk.red(err.message))
    }
    process.exit(1)
  })
}

module.exports = runServer


