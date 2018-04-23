const { APP_PACKAGE_JSON, browserslist } = require('../lib/env-global')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const pkg = require(APP_PACKAGE_JSON)

const styleLoader = (loader, postcssPlugins, isDebug) => {
  let loaders = [{
    loader: 'css-loader',
    options: {
      importLoaders: 1,
      minimize: !isDebug,
      sourceMap: isDebug
    }
  }, {
    loader: 'postcss-loader',
    options: {
      sourceMap: isDebug,
      ident: 'postcss',
      plugins: loader => [
        require('postcss-import')({
          root: loader.resourcePath
        }),
        ...postcssPlugins.map(plugin => require(plugin)()),
        require('autoprefixer')({
          browsers: pkg.browserslist || browserslist
        }),
        require('cssnano')({
          preset: 'advanced',
          reduceIdents: false,
          safe: true
        })
      ]
    }
  }]

  if (loader) {
    loaders.push({
      loader: loader,
      options: {
        sourceMap: isDebug
      }
    })
  }

  return isDebug ? ['style-loader'].concat(loaders) : [MiniCssExtractPlugin.loader].concat(loaders)
}

module.exports = styleLoader
