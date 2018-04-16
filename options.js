module.exports = () => ({
  entry: [
    '@babel/polyfill',
    '<rootDir>/src/index.js'
  ],
  template: '<rootDir>/public/index.html',
  env: 'development',
  proxyTable: null,
  serverPort: 8080
})