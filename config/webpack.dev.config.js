const webpack = require('webpack')
const entryPoint = require('./entry-point')
const outputPoint = require('./output-point')
const aliasWrapper = require('./alias-wrapper')
const baseConfig = require('./webpack.base.config')
const { getRealPath } = require('../lib/env-global')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')

module.exports = (
  entry,
  assetsPath,
  favicon,
  template,
  alias,
  postcssPlugins,
  preLint,
  env
) => ({
  ...aliasWrapper(
    baseConfig(
      entryPoint(entry),
      outputPoint(),
      assetsPath,
      postcssPlugins,
      preLint
    ),
    alias
  ),
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      publicPath: '/',
      favicon: getRealPath(favicon),
      template: getRealPath(template)
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(env),
        PUBLIC_URL: JSON.stringify('')
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ]
});
