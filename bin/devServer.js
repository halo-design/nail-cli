const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const { log } = require('../utils');
const getWebpackConfig = require('../config/webpack/dev');
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

const runServer = opts => {
  const {
    publicDir, proxyTable, autoOpenBrowser, callback,
  } = opts;
  const publicPath = '/';

  const SET_HOST = process.env.HOST || '0.0.0.0';
  const SET_PORT = parseInt(process.env.PORT, 10) || opts.devServerPort;

  const webpackConfig = getWebpackConfig(opts);

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

      const proxyConfig = prepareProxy(proxyTable, getRealPath(publicDir));
      const devServerConfig = getServerConfig(
        proxyConfig,
        urls.lanUrlForConfig,
        publicDir,
        publicPath,
      );

      const devServer = new WebpackDevServer(compiler, devServerConfig);

      devServer.listen(port, SET_HOST, err => {
        if (err) {
          log.red(err);
        } else {
          log.cyan('🚀 Starting the development server...\n');

          if (autoOpenBrowser) {
            openBrowser(urls.localUrlForBrowser);
          }

          if (callback) {
            callback(urls);
          }
        }
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
