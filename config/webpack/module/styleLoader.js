const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { browserslist } = require('../../../env');

const styleLoader = (loader, postcssPlugins, isDebug) => {
  const loaders = [
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1,
        sourceMap: isDebug,
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: isDebug,
        ident: 'postcss',
        plugins: opts => [
          require('postcss-import')({
            root: opts.resourcePath,
          }),
          ...postcssPlugins.map(plugin => require(plugin)()),
          require('autoprefixer')({
            overrideBrowserslist: browserslist,
          }),
          require('cssnano')({
            reduceIdents: false,
            safe: true,
          }),
        ],
      },
    },
  ];

  if (loader) {
    loaders.push({
      loader,
      options: {
        sourceMap: isDebug,
      },
    });
  }

  return isDebug
    ? ['style-loader'].concat(loaders)
    : [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            minimize: !isDebug,
            sourceMap: isDebug,
          },
        },
      ].concat(loaders);
};

module.exports = styleLoader;
