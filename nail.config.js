module.exports = {
  entry: [
    '@babel/polyfill',
    '<rootDir>/src/index.js',
  ],
  template: '<rootDir>/public/index.html',
  devServerPort: 3000,
  buildServerPort: 3001,
  publicPath: '/nail/',
  assetsPath: 'static/',
  proxyTable: {
    '/data': {
      target: 'http://106.14.138.86:7000',
      changeOrigin: true,
    },
  },
  alias: {
    '~': '<rootDir>/src',
    '@': '<rootDir>/src/views',
    '#': '<rootDir>/src/assets',
    '&': '<rootDir>/src/models',
    '^': '<rootDir>/src/components',
  },
  eslintExtend: 'airbnb',
  autoOpenBrowser: true,
  lintOnSave: true,
  pwa: true,
};
