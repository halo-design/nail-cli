module.exports = () => ({
  entry: [
    '@babel/polyfill',
    '<rootDir>/src/index.js'
  ],
  template: '<rootDir>/public/index.html',
  favicon: '<rootDir>/public/favicon.ico',
  outputDir: '<rootDir>/dist',
  publicDir: '<rootDir>/public',
  reportDir: '<rootDir>/report',
  assetsPath: 'static/',
  publicPath: '/',
  alias: {},
  proxyTable: null,
  devServerPort: 8080,
  buildServerPort: 9090,
  autoOpenBrowser: true,
  productionSourceMap: false,
  postcssPlugins: [
    'postcss-flexbugs-fixes',
    'postcss-custom-properties',
    'postcss-custom-media',
    'postcss-media-minmax',
    'postcss-custom-selectors',
    'postcss-calc',
    'postcss-nesting',
    'postcss-nested',
    'postcss-color-function',
    'pleeease-filters',
    'pixrem',
    'postcss-selector-matches',
    'postcss-selector-not',
    'postcss-flexbugs-fixes',
    'postcss-flexibility'
  ],
  parallel: require('os').cpus().length > 1,
  lintOnSave: true,
  jestConfig: {}
})
