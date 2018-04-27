const chalk = require('chalk')
const webpack = require('webpack')
const { log } = require('../utils')
const WebpackDevServer = require('webpack-dev-server')
const getServerConfig = require('../config/webpack/server')
const openBrowser = require('../utils/openBrowser')
const getDevConfig = require('../config/webpack/dev')
const { config, protocol, getRealPath, useYarn } = require('../env')
const { choosePort, prepareUrls, createCompiler, prepareProxy } = require('../utils/WebpackDevServerUtils')

const runServer = opts => {
  const { publicDir, proxyTable, devServerPort, autoOpenBrowser, callback} = opts

  const SET_HOST = process.env.HOST || '0.0.0.0'
  const SET_PORT = parseInt(process.env.PORT, 10) || devServerPort

  const devConfig = getDevConfig(opts)

  choosePort(SET_HOST, SET_PORT)
    .then(port => {
      if (!port) {
        log.yellow('We have not found a port!')
        return
      }
      const urls = prepareUrls(protocol, SET_HOST, port)
      const compiler = createCompiler(webpack, devConfig, config.app.packageJson.name, urls, useYarn)

      compiler.plugin('done', stats => {
        callback && callback(stats)
      })

      const proxyConfig = prepareProxy(proxyTable, getRealPath(publicDir))
      const devServer = new WebpackDevServer(compiler, getServerConfig(
        true,
        proxyConfig,
        urls.lanUrlForConfig,
        publicDir
      ))

      devServer.listen(port, SET_HOST, err => {
        if (err) {
          return log.red(err)
        }
        log.cyan('Starting the development server...\n')
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
        log.red(err.message)
      }
      process.exit(1)
    })
}

module.exports = runServer
