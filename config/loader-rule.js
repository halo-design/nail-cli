const reg = require('../lib/reg')
const styleLoader = require('./style-loader')
const { ROOT, appResolve, env, browserslist } = require('../lib/env-global')
const pkg = require(appResolve('package.json'))

const assetName = env.debug()
  ? '[path][name].[ext]?[hash:8]'
  : '[name].[hash:8].[ext]'

module.exports = postcssPlugins => [{
  test: reg.script,
  include: [ROOT.APP],
  loader: 'babel-loader',
  options: {
    cacheDirectory: env.debug(),

    babelrc: false,
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            browsers: pkg.browserslist || browserslist,
            forceAllTransforms: !env.debug()
          },
          modules: false,
          useBuiltIns: false,
          debug: false
        }
      ],
      '@babel/preset-stage-2',
      ['@babel/preset-react', { development: env.debug() }]
    ],
    plugins: env.debug()
      ? []
      : [
        '@babel/transform-react-constant-elements',
        '@babel/transform-react-inline-elements',
        'transform-react-remove-prop-types'
      ]
    }
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
