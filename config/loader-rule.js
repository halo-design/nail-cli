const reg = require('../lib/reg')
const { ROOT, appResolve, env, browserslist } = require('../lib/env-global')
const pkg = require(appResolve('package.json'))

module.exports = [{
  test: reg.script,
  include: [ROOT.APP],
  loader: 'babel-loader',
  options: {
    cacheDirectory: env.debug,

    babelrc: false,
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            browsers: pkg.browserslist || browserslist,
            forceAllTransforms: !env.debug
          },
          modules: false,
          useBuiltIns: false,
          debug: false
        }
      ],
      '@babel/preset-stage-2',
      ['@babel/preset-react', { development: env.debug }]
    ],
    plugins: env.debug
    ? []
    : [
      '@babel/transform-react-constant-elements',
      '@babel/transform-react-inline-elements',
      'transform-react-remove-prop-types'
    ]
  }
}]
