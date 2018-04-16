const webpack = require('webpack')
const entryPoint = require('./entry-point')
const outputPoint = require('./output-point')
const baseConfig = require('./webpack.base.config')
const { getRealPath } = require('../lib/env-global')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const AnalyzeWebpackPlugin = require('analyze-webpack-plugin').default
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')

module.exports = (entry, template, env) => ({
  ...baseConfig(
    entryPoint(entry),
    outputPoint()
  ),
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: getRealPath(template)
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(env)
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // visit http://localhost:3000/analyze.html
    new AnalyzeWebpackPlugin()
  ],
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
