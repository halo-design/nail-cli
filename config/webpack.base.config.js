const loaderRule = require('./loader-rule')
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin')
const { ROOT, is, APP_SRC_DIR, APP_PACKAGE_JSON } = require('../lib/env-global')

module.exports = (
  isDebug,
  entryPoint,
  outputPoint,
  assetsPath,
  postcssPlugins,
  preLint
) => ({
  context: ROOT.APP,

  mode: isDebug ? 'development' : 'production',

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

    rules: loaderRule(isDebug, assetsPath, postcssPlugins, preLint)
  },

  bail: !isDebug,

  cache: isDebug,

  stats: {
    cached: is.verbose,
    cachedAssets: is.verbose,
    chunks: is.verbose,
    chunkModules: is.verbose,
    colors: true,
    hash: is.verbose,
    modules: is.verbose,
    reasons: isDebug,
    timings: true,
    version: is.verbose
  },

  devtool: isDebug ? 'cheap-module-inline-source-map' : 'source-map',

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
