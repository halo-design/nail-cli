const webpack = require('webpack');
const merge = require('webpack-merge');
const WebpackCdnPlugin = require('webpack-cdn-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const { getRealPath } = require('../../env');

const setBaseConfig = ({
  cdn,
  favicon,
  template,
}) => {
  const baseDevConfig = {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('development'),
          PUBLIC_URL: JSON.stringify(''),
        },
      }),
      new webpack.HotModuleReplacementPlugin(),
      new CaseSensitivePathsPlugin(),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
  }

  if (cdn) {
    baseDevConfig.plugins.unshift(
      new WebpackCdnPlugin(cdn)
    );
  };

  baseDevConfig.plugins.unshift(
    new HtmlWebpackPlugin({
      inject: true,
      publicPath: '/',
      favicon: getRealPath(favicon),
      template: getRealPath(template),
    })
  );

  return baseDevConfig;
};

const setDevConfig = opts => merge(
  require('./base')(true),
  require('./module/alias')(opts),
  require('./module/entry')(opts, true),
  require('./module/output')({
    ...opts,
    ...{
      assetsPath: '',
      publicPath: '/',
    },
  }, true),
  require('./module/rule')(opts, true),
  setBaseConfig(opts),
);

module.exports = setDevConfig;
