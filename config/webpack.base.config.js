const loaderRule = require('./loader-rule')
const { ROOT, is, APP_SRC_DIR, APP_PACKAGE_JSON, env } = require('../lib/env-global')
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin')

module.exports = (entryPoint, outputPoint, postcssPlugins, preLint) => ({
  context: ROOT.APP,

  mode: env.debug() ? 'development' : 'production',

  entry: {
    app: entryPoint
  },

  output: outputPoint,

  resolve: {
    modules: ['node_modules', 'src'],
    extensions: ['.js', '.json', '.jsx'],
    plugins: [
      new ModuleScopePlugin(APP_SRC_DIR, [APP_PACKAGE_JSON])
    ]
  },

  module: {
    strictExportPresence: true,

    rules: loaderRule(postcssPlugins, preLint)
  },

  bail: !env.debug(),

  cache: env.debug(),

  stats: {
    cached: is.verbose,
    cachedAssets: is.verbose,
    chunks: is.verbose,
    chunkModules: is.verbose,
    colors: true,
    hash: is.verbose,
    modules: is.verbose,
    reasons: env.debug(),
    timings: true,
    version: is.verbose
  },

  devtool: env.debug() ? 'cheap-module-inline-source-map' : 'source-map',

  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },

  performance: {
    hints: false
  }
})
