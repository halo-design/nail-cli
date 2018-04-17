module.exports = () => ({
  entry: [
    '@babel/polyfill',
    '<rootDir>/src/index.js'
  ],
  template: '<rootDir>/public/index.html',
  outputDir: '<rootDir>/dist',
  publicDir: '<rootDir>/public',
  publicPath: '/',
  alias: {},
  proxyTable: null,
  devServerPort: 8080,
  autoOpenBrowser: true,
  productionSourceMap: false,
  postcssPlugins: [
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
  dll: true
})