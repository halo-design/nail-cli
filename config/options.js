module.exports = {
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
  autoOpenBrowser: false,
  productionSourceMap: false,
  postcssPlugins: [
    'postcss-flexbugs-fixes',
    'postcss-flexibility'
  ],
  parallel: require('os').cpus().length > 1,
  lintOnSave: true,
  isAnalyze: false,
  jestConfig: {},
  babelConfig: {},
  eslintConfig: {}
}
