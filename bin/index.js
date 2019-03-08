#!/usr/bin/env node
const execa = require('execa');
const semver = require('semver');
const program = require('commander');
const jestTest = require('./jest');
const runBuild = require('./build');
const runDevServer = require('./devServer');
const runProdServer = require('./prodServer');
const { log, removeLastSlash } = require('../utils');
const { protocol, config: { app, local } } = require('../env');

const requiredVersion = app.packageJson.engines.node;

if (!semver.satisfies(process.version, requiredVersion)) {
  log.yellow(`You are using Node ${process.version}, but nail-cli `
    + `requires Node ${requiredVersion}.\nPlease upgrade your Node version.`);
  process.exit(1);
}

const setProdEnv = stats => {
  const mode = stats ? 'production' : 'development';
  process.env.NODE_ENV = mode;
  process.env.BABEL_ENV = mode;
};

const finalConfig = {
  ...local.options,
  ...app.options,
};

// process.traceDeprecation = true
process.noDeprecation = true;

program
  .version(local.packageJson.version, '-v, --version')
  .command('serve')
  .option('-o --open', 'Development mode launches local services')
  .option('-p --production', 'Production mode launches local services')
  .action(cmd => {
    if (cmd.open) {
      finalConfig.autoOpenBrowser = true;
    }
    if (cmd.production) {
      setProdEnv(true);
      finalConfig.isAnalyze = false;
      runProdServer(finalConfig);
    } else {
      setProdEnv(false);
      runDevServer(finalConfig);
    }
  });

program
  .command('build')
  .option('-a --analyze', 'Generate the packaging analysis report')
  .action(cmd => {
    process.env.PUBLIC_URL = removeLastSlash(finalConfig.publicPath);
    setProdEnv(true);
    if (cmd.analyze) {
      finalConfig.isAnalyze = true;
    }
    runBuild(finalConfig);
  });

program
  .command('unit')
  .action(() => {
    jestTest(finalConfig.jestConfig, ['--coverage']);
  });

program
  .command('e2e')
  .option('-o --open', 'Open cypress for testing')
  .action(cmd => {
    let cyArgv = ['--config', `baseUrl=${protocol}://localhost:${finalConfig.devServerPort}/`];
    cyArgv = [cmd.open ? 'open' : 'run'].concat(cyArgv);

    finalConfig.autoOpenBrowser = false;
    finalConfig.callback = () => {
      log.cyan('It\'s starting cypress...\n');
      try {
        const cypressBinPath = require.resolve('cypress/bin/cypress');
        execa(cypressBinPath, cyArgv, { stdio: 'inherit' });
      } catch (e) {
        log.yellow('If you need an e2e test feature, install the cypress module please.\n');
        process.exit(0);
      }
    };

    setProdEnv(false);
    runDevServer(finalConfig);
  });

program.parse(process.argv);
