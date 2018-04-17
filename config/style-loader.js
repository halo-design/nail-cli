const { appResolve, env: { debug }, browserslist } = require('../lib/env-global')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const pkg = require(appResolve('package.json'))

const styleLoader = (loader, options, postcssPlugins) => {
  options = options || {}

  let loaders = [{
    loader: 'css-loader',
    options: {
      importLoaders: 1,
      minimize: !debug(),
      sourceMap: debug()
    }
  }, {
    loader: 'postcss-loader',
    options: {
      sourceMap: debug(),
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
      options: Object.assign({}, options, {
        sourceMap: debug()
      })
    })
  }

  if (!debug()) {
    return ['style-loader', MiniCssExtractPlugin.loader].concat(loaders)
  } else {
    return ['style-loader'].concat(loaders)
  }
}

module.exports = styleLoader
