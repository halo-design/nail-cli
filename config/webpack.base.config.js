const loaderRule = require('./loader-rule')
const { ROOT, is, env } = require('../lib/env-global')

module.exports = (entryPoint, outputPoint) => ({
  context: ROOT.APP,

  mode: env.debug ? 'development' : 'production',

  entry: {
    app: entryPoint
  },

  output: outputPoint,

  resolve: {
    modules: ['node_modules', 'src'],
    extensions: ['.js', '.json', '.jsx']
  },

  module: {
    strictExportPresence: true,

    rules: loaderRule
  },

  bail: !env.debug,

  cache: env.debug,

  stats: {
    cached: is.verbose,
    cachedAssets: is.verbose,
    chunks: is.verbose,
    chunkModules: is.verbose,
    colors: true,
    hash: is.verbose,
    modules: is.verbose,
    reasons: env.debug,
    timings: true,
    version: is.verbose,
  },

  devtool: env.debug ? 'cheap-module-inline-source-map' : 'source-map'
})