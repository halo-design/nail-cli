const webpack = require('webpack')
const entryPoint = require('./entry-point')
const outputPoint = require('./output-point')
const aliasWrapper = require('./alias-wrapper')
const baseConfig = require('./webpack.base.config')
const { getRealPath } = require('../lib/env-global')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')

module.exports = (entry, template, alias, postcssPlugins, preLint, favicon, env) => ({
  ...aliasWrapper(
    baseConfig(
      entryPoint(entry),
      outputPoint(),
      postcssPlugins,
      preLint
    ),
    alias
  ),
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      favicon: getRealPath(favicon),
      template: getRealPath(template)
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(env)
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ]
})
