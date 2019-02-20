const chalk = require('chalk');
const webpack = require('webpack');
const postcss = require('postcss');
const merge = require('webpack-merge');
const comments = require('postcss-discard-comments');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const LastCallWebpackPlugin = require('last-call-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const { removeLastSlash } = require('../../utils');
const {
  getRealPath, config, author, githubSite, license,
} = require('../../env');

const setBaseBuildConfig = ({
  pwa,
  favicon,
  parallel,
  template,
  isAnalyze,
  reportDir,
  publicPath,
  assetsPath,
  productionSourceMap,
}) => {
  const baseBuildConfig = {
    optimization: {
      runtimeChunk: false,
      splitChunks: {
        cacheGroups: {
          commons: {
            chunks: 'initial',
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0,
          },
          styles: {
            name: 'styles',
            test: /\.css$/,
            chunks: 'all',
            enforce: true,
          },
          vendor: {
            chunks: 'initial',
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            priority: 10,
            enforce: true,
          },
        },
      },
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
          parallel,
          cache: true,
          sourceMap: productionSourceMap,
        }),
      ],
    },
    plugins: [
      new ProgressBarPlugin({
        complete: chalk.green('█'),
        incomplete: chalk.white('█'),
        format: `  :bar ${chalk.green.bold(':percent')} (:elapsed seconds) `,
        clear: false,
      }),
      new HtmlWebpackPlugin({
        pwa,
        publicPath,
        inject: true,
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
          minifyURLs: true,
        },
      }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
          PUBLIC_URL: JSON.stringify(removeLastSlash(publicPath)),
        },
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new MiniCssExtractPlugin({
        filename: `${assetsPath}css/[name].[contenthash:8].min.css`,
        chunkFilename: `${assetsPath}css/[id].[contenthash:8].min.css`,
      }),
    ],
  };

  if (isAnalyze) {
    const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
    baseBuildConfig.plugins.push(new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: getRealPath(`${reportDir}/analyze/${
        (new Date()).toLocaleString()
          .replace(/ /g, '_')
      }.html`),
    }));
  }

  const comment = '/*!\n'
  + ` * Build By @nail-cli/core@${config.local.packageJson.version}\n`
  + ` * (c) 2018-2019 ${author}\n`
  + ` * GitHub ${githubSite}\n`
  + ` * Released under the ${license} License.\n`
  + ' */\n';

  const assetProcessors = [{
    regExp: /\.js$/,
    processor: (assetName, asset) => Promise.resolve(comment + asset.source()),
  }];

  if (productionSourceMap) {
    assetProcessors.push({
      regExp: /\.css$/,
      processor: (assetName, asset) => Promise.resolve(comment + asset.source()),
    });
  } else {
    assetProcessors.push({
      regExp: /\.css$/,
      processor: (assetName, asset, assets) => {
        assets.setAsset(`${assetName}.map`, null);
        return postcss(comments({ removeAll: true }))
          .process(asset.source(), { from: undefined })
          .then(r => comment + r.css);
      },
    });
  }

  baseBuildConfig.plugins.push(new LastCallWebpackPlugin({
    assetProcessors,
    canPrint: true,
  }));

  if (pwa) {
    baseBuildConfig.plugins.push(
      new ManifestPlugin({
        fileName: 'precache-manifest.json',
      }),
      new SWPrecacheWebpackPlugin({
        filename: 'service-worker.js',
        cacheId: config.app.packageJson.name,
        dontCacheBustUrlsMatching: /\.\w{8}\./,
        staticFileGlobsIgnorePatterns: [/\.map$/, /precache-manifest\.json$/],
        minify: true,
      }),
      new PreloadWebpackPlugin({
        rel: 'prefetch',
        include: 'asyncChunks',
      }),
      new PreloadWebpackPlugin({
        rel: 'preload',
        include: 'initial',
      }),
    );
  }

  return baseBuildConfig;
};

const setBuildConfig = opts => merge(
  require('./base')(false),
  require('./module/alias')(opts),
  require('./module/entry')(opts, false),
  require('./module/output')(opts, false),
  require('./module/rule')(opts, false),
  setBaseBuildConfig(opts),
);

module.exports = setBuildConfig;
