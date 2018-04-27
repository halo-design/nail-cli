const chalk = require('chalk')
const webpack = require('webpack')
const postcss = require('postcss')
const entryPoint = require('./entry-point')
const outputPoint = require('./output-point')
const aliasWrapper = require('./alias-wrapper')
const { removeLastSlash } = require('../lib/utils')
const baseConfig = require('./webpack.base.config')
const comments = require('postcss-discard-comments')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { getRealPath, isAnalyze } = require('../lib/env-global')
const ManifestPlugin = require('webpack-manifest-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const LastCallWebpackPlugin = require('last-call-webpack-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')

module.exports = (
  entry,
  outputDir,
  reportDir,
  publicPath,
  assetsPath,
  favicon,
  template,
  alias,
  postcssPlugins,
  productionSourceMap,
  parallel,
  env
) => {
  let buildConfig = {
    ...aliasWrapper(
      baseConfig(
        false,
        entryPoint(false, entry),
        outputPoint(false, outputDir, publicPath, assetsPath),
        assetsPath,
        postcssPlugins,
        false
      ),
      alias
    ),
    optimization: {
      runtimeChunk: false,
      splitChunks: {
        cacheGroups: {
          commons: {
            chunks: 'initial',
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0
          },
          styles: {
            name: 'styles',
            test: /\.css$/,
            chunks: 'all',
            enforce: true
          },
          vendor: {
            chunks: 'initial',
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            priority: 10,
            enforce: true
          }
        },
      },
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              warnings: false,
              comparisons: false
            },
            mangle: {
              safari10: true
            },
            output: {
              comments: false,
              ascii_only: true
            }
          },
          cache: true,
          parallel: parallel,
          sourceMap: productionSourceMap
        })
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: true,
        publicPath: publicPath,
        template: getRealPath(template),
        favicon: getRealPath(favicon),
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true
        }
      }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(env),
          PUBLIC_URL: JSON.stringify(removeLastSlash(publicPath))
        }
      }),
      new ManifestPlugin({
        fileName: 'asset-manifest.json'
      }),
      new SWPrecacheWebpackPlugin({
        dontCacheBustUrlsMatching: /\.\w{8}\./,
        filename: 'service-worker.js',
        minify: true,
        staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/]
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new MiniCssExtractPlugin({
        filename: `${assetsPath}css/[name].[contenthash:8].min.css`,
        chunkFilename: `${assetsPath}css/[id].[contenthash:8].min.css`
      })
    ]
  }

  if (isAnalyze) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    buildConfig.plugins.push(new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: getRealPath(`${reportDir}/analyze/${Date.now()}.html`)
    }))
  }

  if (!productionSourceMap) {
    buildConfig.plugins.push(
      new LastCallWebpackPlugin({
        assetProcessors: [{
          regExp:  /\.css$/,
          processor: (assetName, asset, assets) =>  {
            assets.setAsset(`${assetName}.map`, null)
            return postcss(comments({ removeAll: true }))
              .process(asset.source(), { from: void 0 })
              .then(r => r.css)
          }
        }],
        canPrint: true
      })
    )
  }

  return buildConfig
}
