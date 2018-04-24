module.exports = {
  proxyTable: {
    '/api': {
      target: 'http://www.example.com',
      changeOrigin: true
    }
  }
}
