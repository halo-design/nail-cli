module.exports = {
  entry: [
    '@babel/polyfill',
    '<rootDir>/src/index.js',
  ],
  template: '<rootDir>/public/index.html',
  devServerPort: 8080,
  buildServerPort: 9090,
  publicPath: '/nail/',
  assetsPath: 'static/',
  proxyTable: {
    '/data': {
      target: 'http://yuis.qiniudn.com',
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
