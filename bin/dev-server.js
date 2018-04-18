const chalk = require('chalk')
const webpack = require('webpack')
const devConfigGenerator = require('../config/webpack.dev.config')
const devServerConfig = require('../config/devServer.config')
const WebpackDevServer = require('webpack-dev-server')
const openBrowser = require('react-dev-utils/openBrowser')
const { appResolve, getRealPath, useYarn } = require('../lib/env-global')
const { choosePort, prepareUrls, createCompiler, prepareProxy } = require('react-dev-utils/WebpackDevServerUtils')
const pkg = require(appResolve('package.json'))

const runServer = ({
  entry,
  template,
  alias,
  publicDir,
  proxyTable,
  devServerPort,
  postcssPlugins,
  autoOpenBrowser,
  lintOnSave,
  favicon
}) => {
  const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
  const SET_HOST = process.env.HOST || '0.0.0.0'
  const SET_PORT = parseInt(process.env.PORT, 10) || devServerPort

  const devConfig = devConfigGenerator(entry, template, alias, postcssPlugins, lintOnSave, favicon, 'development')

  choosePort(SET_HOST, SET_PORT)
    .then(port => {
      if (!port) {
        console.log(chalk.yellow('We have not found a port!'))
        return
      }
      const urls = prepareUrls(protocol, SET_HOST, port)
      const compiler = createCompiler(webpack, devConfig, pkg.name, urls, useYarn)

      const proxyConfig = prepareProxy(proxyTable, getRealPath(publicDir))
      const devServer = new WebpackDevServer(compiler, devServerConfig(
        proxyConfig,
        urls.lanUrlForConfig,
        publicDir
      ))

      devServer.listen(port, SET_HOST, err => {
        if (err) {
          return console.log(chalk.red(err))
        }
        console.log(chalk.cyan('Starting the development server...\n'))
        autoOpenBrowser && openBrowser(urls.localUrlForBrowser)
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
