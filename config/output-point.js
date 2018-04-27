const path = require('path')
const { getRealPath } = require('../lib/env-global')

module.exports = (
  isDebug = true,
  outputDir = '<rootDir>/dist',
  publicPath = '/',
  assetsPath = ''
) => ({
  path: getRealPath(outputDir),
  publicPath,
  pathinfo: true,
  filename: isDebug ? '[name].js' : `${assetsPath}js/[name].[chunkhash:8].min.js`,
  chunkFilename: isDebug ? '[name].chunk.js' : `${assetsPath}js/[name].[chunkhash:8].chunk.min.js`,
  devtoolModuleFilenameTemplate: info =>
    path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
})
