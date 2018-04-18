module.exports = {
  entry: [
    '@babel/polyfill',
    '<rootDir>/src/index.js'
  ],
  template: '<rootDir>/public/app.html',
  devServerPort: 3001,
  publicPath: '/nail/',
  proxyTable: {
    '/music': {
      target: 'http://yuis.qiniudn.com',
      changeOrigin: true
    }
  },
  alias: {
    '~': '<rootDir>/src',
    '@': '<rootDir>/src/views',
    '#': '<rootDir>/src/assets',
    '&': '<rootDir>/src/models',
    '^': '<rootDir>/src/components'
  },
  autoOpenBrowser: true
}