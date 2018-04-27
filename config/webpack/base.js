const ModuleScopePlugin = require('../../utils/devtools/ModuleScopePlugin')
const { dir } = require('../../env')

module.exports = isDebug => ({
  context: dir.app.root,

  mode: isDebug ? 'development' : 'production',

  resolve: {
    modules: ['node_modules', 'src'],
    extensions: ['.js', '.json', '.jsx'],
    plugins: [
      new ModuleScopePlugin(dir.app.src, [dir.app.packageJson])
    ]
  },

  module: {
    strictExportPresence: true
  },

  bail: !isDebug,
  cache: isDebug,
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
