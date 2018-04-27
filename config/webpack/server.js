const { getRealPath } = require('../../env')
const noopServiceWorkerMiddleware = require('../../utils/noopServiceWorkerMiddleware')

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
const SET_HOST = process.env.HOST || '0.0.0.0'

module.exports = (isDebug, proxy, allowedHost, publicDir, publicPath) => ({
  disableHostCheck: !proxy || process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true',
  compress: true,
  clientLogLevel: 'none',
  contentBase: getRealPath(publicDir),
  watchContentBase: true,
  hot: isDebug,
  publicPath: publicPath || '/',
  quiet: true,
  watchOptions: {
    ignored: /node_modules/,
    poll: true
  },
  https: protocol === 'https',
  host: SET_HOST,
  overlay: false,
  historyApiFallback: {
    disableDotRule: true
  },
  public: allowedHost,
  proxy,
  before (app) {
    app.use(noopServiceWorkerMiddleware())
  }
})
