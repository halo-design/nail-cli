const chalk = require('chalk')
const webpack = require('webpack')
const buildConfigGenerator = require('../config/webpack.build.config')
const buildServerConfig = require('../config/server.config')
const WebpackDevServer = require('webpack-dev-server')
const openBrowser = require('react-dev-utils/openBrowser')
const { APP_PACKAGE_JSON, getRealPath, useYarn } = require('../lib/env-global')
const { choosePort, prepareUrls, createCompiler, prepareProxy } = require('react-dev-utils/WebpackDevServerUtils')
const pkg = require(APP_PACKAGE_JSON)

const runServer = ({
  entry,
  outputDir,
  reportDir,
  template,
  alias,
  publicPath,
  publicDir,
  proxyTable,
  buildServerPort,
  postcssPlugins,
  productionSourceMap,
  parallel,
  autoOpenBrowser,
  lintOnSave,
  favicon
}) => {
  const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
  const SET_HOST = process.env.HOST || '0.0.0.0'
  const SET_PORT = parseInt(process.env.PORT, 10) || buildServerPort

  const buildConfig = buildConfigGenerator(
    entry,
    outputDir,
    reportDir,
    publicPath,
    template,
    alias,
    postcssPlugins,
    productionSourceMap,
    parallel,
    'production'
  )

  choosePort(SET_HOST, SET_PORT)
    .then(port => {
      if (!port) {
        console.log(chalk.yellow('We have not found a port!'))
        return
      }
      const urls = prepareUrls(protocol, SET_HOST, port)
      const compiler = createCompiler(webpack, buildConfig, pkg.name, urls, useYarn)

      if (publicPath !== '/') {
        const proxyKey = publicPath.substring(0, publicPath.length - 1)

        let rerite = {}
        rerite[`^${proxyKey}`] = ''

        let proxy = {}
        proxy['pathRewrite'] = rerite
        proxy['target'] = `${protocol}://localhost:${port}`
        proxyTable[proxyKey] = proxy
      }

      const proxyConfig = prepareProxy(proxyTable, getRealPath(publicDir))
      const devServer = new WebpackDevServer(compiler, buildServerConfig(
        proxyConfig,
        urls.lanUrlForConfig,
        publicDir,
        publicPath
      ))

      devServer.listen(port, SET_HOST, err => {
        if (err) {
          return console.log(chalk.red(err))
        }
        console.log(chalk.cyan('Starting the production server...\n'))
        autoOpenBrowser && openBrowser(urls.localUrlForBrowser + publicPath.substr(1))
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
