const path = require('path')
const { getRealPath, is, env } = require('../lib/env-global')

module.exports = (
  outputDir = '<rootDir>/dist',
  publicPath = '/'
) => ({
  path: getRealPath(outputDir),
  publicPath,
  pathinfo: is.verbose,
  filename: env.debug() ? '[name].js' : 'js/[name].[chunkhash:8].js',
  chunkFilename: env.debug() ? '[name].chunk.js' : 'js/[name].[chunkhash:8].chunk.js',
  devtoolModuleFilenameTemplate: info =>
    path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
})
