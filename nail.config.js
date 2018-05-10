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
    '/music': {
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
  eslintType: 'airbnb',
  autoOpenBrowser: true,
  lintOnSave: true,
};
