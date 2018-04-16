const { appResolve } = require('../lib/env-global')
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware')

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
const SET_HOST = process.env.HOST || '0.0.0.0'

module.exports = (publicPath, proxy, allowedHost) => ({
  disableHostCheck: !proxy || process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true',
  compress: true,
  clientLogLevel: 'none',
  contentBase: appResolve('public'),
  watchContentBase: true,
  hot: true,
  publicPath,
  quiet: true,
  watchOptions: {
    ignored: /node_modules/,
  },
  https: protocol === 'https',
  host: SET_HOST,
  overlay: false,
  historyApiFallback: {
    disableDotRule: true
  },
  public: allowedHost,
  proxy,
  setup (app) {
    app.use(noopServiceWorkerMiddleware())
  }
})
