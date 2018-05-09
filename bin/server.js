const webpack = require('webpack');
const { log } = require('../utils');
const WebpackDevServer = require('webpack-dev-server');
const getServerConfig = require('../config/webpack/server');
const openBrowser = require('../utils/devtools/openBrowser');
const {
  config, protocol, getRealPath, useYarn,
} = require('../env');
const {
  choosePort,
  prepareUrls,
  createCompiler,
  prepareProxy,
} = require('../utils/devtools/WebpackDevServerUtils');

const runServer = (opts, isDev) => {
  const {
    publicDir, proxyTable, autoOpenBrowser, callback,
  } = opts;
  const publicPath = isDev ? '/' : opts.publicPath;

  const SET_HOST = process.env.HOST || '0.0.0.0';
  const SET_PORT = parseInt(process.env.PORT, 10)
    || (isDev ? opts.devServerPort : opts.buildServerPort);

  const webpackConfig = isDev
    ? require('../config/webpack/dev')(opts)
    : require('../config/webpack/build')(opts);

  choosePort(SET_HOST, SET_PORT)
    .then(port => {
      if (!port) {
        log.yellow('We have not found a port!');
        return;
      }
      const urls = prepareUrls(protocol, SET_HOST, port);
      const compiler = createCompiler(
        webpack,
        webpackConfig,
        config.app.packageJson.name,
        urls,
        useYarn,
      );

      if (!isDev) {
        const proxyKey = publicPath.substring(0, publicPath.length - 1);

        const rerite = {};
        rerite[`^${proxyKey}`] = '';

        const proxy = {};
        proxy.pathRewrite = rerite;
        proxy.target = urls.localUrlForBrowser;
        proxyTable[proxyKey] = proxy;
      }

      const proxyConfig = prepareProxy(proxyTable, getRealPath(publicDir));
      const devServerConfig = getServerConfig(
        isDev,
        proxyConfig,
        urls.lanUrlForConfig,
        publicDir,
        publicPath,
      );

      const devServer = new WebpackDevServer(compiler, devServerConfig);

      devServer.listen(port, SET_HOST, err => {
        if (err) {
          return log.red(err);
        }
        isDev
          ? log.cyan('Starting the development server...\n')
          : log.cyan('Starting the production server...\n');

        autoOpenBrowser && openBrowser(urls.localUrlForBrowser + publicPath.substr(1));
        callback && callback(urls);
      });
      ['SIGINT', 'SIGTERM'].forEach(signal => {
        process.on(signal, () => {
          devServer.close(() => {
            process.exit(0);
          });
        });
      });
    })
    .catch(err => {
      if (err && err.message) {
        log.red(err.message);
      }
      process.exit(1);
    });
};

module.exports = runServer;
