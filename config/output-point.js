const path = require('path')
const { getRealPath, is, env } = require('../lib/env-global')

module.exports = (
  outputDir = '<rootDir>/dist',
  publicPath = '/',
  assetsPath = ''
) => ({
  path: getRealPath(outputDir),
  publicPath,
  pathinfo: is.verbose,
  filename: env.debug() ? '[name].js' : `${assetsPath}js/[name].[chunkhash:8].min.js`,
  chunkFilename: env.debug() ? '[name].chunk.js' : `${assetsPath}js/[name].[chunkhash:8].chunk.min.js`,
  devtoolModuleFilenameTemplate: info =>
    path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
})
