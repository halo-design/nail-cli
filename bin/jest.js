process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';
process.env.PUBLIC_URL = '';

const jest = require('jest');
const path = require('path');
const resolve = require('resolve');
const createJestConfig = require('../config/jest');

module.exports = (jestConfig, argv) => {
  if (argv.indexOf('--coverage') < 0) {
    argv.push('--watchAll');
  }

  argv.push('--config', JSON.stringify(createJestConfig(jestConfig)));

  const resolveJestDefaultEnvironment = name => {
    const jestDir = path.dirname(
      resolve.sync('jest', {
        basedir: __dirname,
      })
    );

    const jestCLIDir = path.dirname(
      resolve.sync('jest-cli', {
        basedir: jestDir,
      })
    );

    const jestConfigDir = path.dirname(
      resolve.sync('jest-config', {
        basedir: jestCLIDir,
      })
    );

    return resolve.sync(name, {
      basedir: jestConfigDir,
    });
  };

  const cleanArgv = [];
  let env = 'node';
  let next;
  do {
    next = argv.shift();
    if (next === '--env') {
      env = argv.shift();
    } else if (next.indexOf('--env=') === 0) {
      env = next.substring('--env='.length);
    } else {
      cleanArgv.push(next);
    }
  } while (argv.length > 0);

  argv = cleanArgv;
  const testEnvironment =
    resolveJestDefaultEnvironment(`jest-environment-${env}`) ||
    resolveJestDefaultEnvironment(env) ||
    env;

  argv.push('--env', testEnvironment);
  jest.run(argv);
};
