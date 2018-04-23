const reg = require('../lib/reg')
const babelrc = require('./babelrc')
const eslintrc = require('./eslintrc')
const styleLoader = require('./style-loader')
const {
  ROOT,
  APP_PACKAGE_JSON,
  APP_SRC_DIR,
  APP_TEST_DIR,
  env,
  browserslist
} = require('../lib/env-global')
const pkg = require(APP_PACKAGE_JSON)

const assetName = env.debug()
  ? '[path][name].[ext]?[hash:8]'
  : '[name].[hash:8].[ext]'

module.exports = (assetsPath, postcssPlugins, preLint) => {
  let baseRules = [{
    test: reg.script,
    include: [ROOT.APP],
    loader: 'babel-loader',
    options: babelrc
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
      name: `${assetsPath}images/${assetName}`
    }
  }, {
    test: reg.font,
    loader: 'url-loader',
    query: {
      limit: 8192,
      name: `${assetsPath}fonts/${assetName}`
    }
  }, {
    test: reg.media,
    loader: 'url-loader',
    options: {
      limit: 10000,
      name: `${assetsPath}media/${assetName}`
    }
  }]

  if (preLint) {
    return [{
      test: reg.script,
      loader: 'eslint-loader',
      enforce: 'pre',
      include: [APP_SRC_DIR, APP_TEST_DIR],
      options: {
        formatter: require('eslint-friendly-formatter'),
        baseConfig: eslintrc
      }
    }].concat(baseRules)
  }

  return baseRules
}
