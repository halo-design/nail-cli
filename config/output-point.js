const path = require('path')
const { appResolve, is, env } = require('../lib/env-global')

module.exports = (
  outputDir = 'dist',
  publicPath = '/'
) => ({
  path: appResolve(outputDir),
  publicPath,
  pathinfo: is.verbose,
  filename: env.debug ? '[name].js' : '[name].[chunkhash:8].js',
  chunkFilename: env.debug ? '[name].chunk.js' : '[name].[chunkhash:8].chunk.js',
  devtoolModuleFilenameTemplate: info =>
    path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
})
