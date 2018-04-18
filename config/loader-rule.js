const reg = require('../lib/reg')
const styleLoader = require('./style-loader')
const { ROOT, appResolve, env, browserslist } = require('../lib/env-global')
const pkg = require(appResolve('package.json'))

const assetName = env.debug()
  ? '[path][name].[ext]?[hash:8]'
  : '[name].[hash:8].[ext]'

module.exports = (postcssPlugins, preLint) => {
  let baseRules = [{
    test: reg.script,
    include: [ROOT.APP],
    loader: 'babel-loader'
  }, {
    test: /\.css$/,
    use: styleLoader(null, null, postcssPlugins)
  }, {
    test: /\.less$/,
    use: styleLoader('less-loader', null, postcssPlugins)
  }, {
    test: /\.(scss|sass)$/,
    use: styleLoader('sass-loader', null, postcssPlugins)
  }, {
    test: /\.(stylus|styl)$/,
    use: styleLoader('stylus-loader', null, postcssPlugins)
  }, {
    test: reg.image,
    loader: 'url-loader',
    query: {
      limit: 8192,
      name: `images/${assetName}`
    }
  }, {
    test: reg.font,
    loader: 'url-loader',
    query: {
      limit: 8192,
      name: `fonts/${assetName}`
    }
  }, {
    test: reg.media,
    loader: 'url-loader',
    options: {
      limit: 10000,
      name: `media/${assetName}`
    }
  }]

  if (preLint) {
    return [{
      test: reg.script,
      loader: 'eslint-loader',
      enforce: 'pre',
      include: [appResolve('src'), appResolve('test')],
      options: {
        formatter: require('eslint-friendly-formatter')
      }
    }].concat(baseRules)
  }

  return baseRules
}
