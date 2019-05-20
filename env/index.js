const fs = require('fs');
const { resolve } = require('path');
const readYaml = require('read-yaml');
const { log } = require('../utils');

const APP_ROOT = resolve();
const LOCAL_ROOT = resolve(__dirname, '..');

const appResolve = args => resolve(APP_ROOT, args);
const localResolve = args => resolve(LOCAL_ROOT, args);

const getRealPath = file =>
  file.indexOf('<rootDir>/') > -1
    ? appResolve(file.replace('<rootDir>/', ''))
    : require.resolve(file);

const LOCAL_PACKAGEJSON_DIR = localResolve('package.json');
const LOCAL_PACKAGEJSON_FILE = require(LOCAL_PACKAGEJSON_DIR);

const APP_SRC_DIR = appResolve('src');
const APP_TEST_DIR = appResolve('test');
const APP_PACKAGEJSON_DIR = appResolve('package.json');
const NAILLOCK = appResolve('.nail.yml');

let APP_NAILCONFIG_DIR = null;
const APP_NAILCONFIG_DIRS = [
  appResolve('nail.config.js'),
  appResolve('nail.config.json'),
];

let APP_NAILCONFIG_FILE;
let APP_PACKAGEJSON_FILE;
let SETAUTHOR = 'OwlAford';
let SETORGSITE = 'https://github.com/halo-design/nail-cli';
let SETLICENSE = 'MIT';

if (fs.existsSync(APP_PACKAGEJSON_DIR)) {
  APP_PACKAGEJSON_FILE = require(APP_PACKAGEJSON_DIR);
} else {
  APP_PACKAGEJSON_FILE = {};
  log.red('\nThe file "package.json" does not exist.\n');
  process.exit(1);
}

if (fs.existsSync(NAILLOCK)) {
  const lockData = readYaml.sync(NAILLOCK);
  const { author, configFile, orgSite, license } = lockData;

  if (author) {
    SETAUTHOR = author;
  }

  if (orgSite) {
    SETORGSITE = orgSite;
  }

  if (license) {
    SETLICENSE = license;
  }

  if (configFile) {
    const SET_NAILCONFIG_DIR = appResolve(configFile);
    if (fs.existsSync(SET_NAILCONFIG_DIR)) {
      APP_NAILCONFIG_FILE = require(SET_NAILCONFIG_DIR);
    } else {
      log.red(
        `\nThe specified nail-cli configuration ${configFile} does not exist.\n`
      );
      process.exit(1);
    }
  }
} else if (fs.existsSync(APP_NAILCONFIG_DIRS[0])) {
  APP_NAILCONFIG_DIR = APP_NAILCONFIG_DIRS[0];
  APP_NAILCONFIG_FILE = require(APP_NAILCONFIG_DIR);
} else if (fs.existsSync(APP_NAILCONFIG_DIRS[1])) {
  APP_NAILCONFIG_DIR = APP_NAILCONFIG_DIRS[1];
  APP_NAILCONFIG_FILE = require(APP_NAILCONFIG_DIR);
} else {
  APP_NAILCONFIG_FILE = {};
  log.yellow('\nThe nail-cli configuration file does not exist.\n');
}

const config = {
  getRealPath,
  orgSite: SETORGSITE,
  author: SETAUTHOR,
  license: SETLICENSE,
  dir: {
    app: {
      root: APP_ROOT,
      src: APP_SRC_DIR,
      test: APP_TEST_DIR,
      nailConfig: APP_NAILCONFIG_DIR,
      packageJson: APP_PACKAGEJSON_DIR,
      resolve: appResolve,
    },
    local: {
      root: LOCAL_ROOT,
      packageJson: LOCAL_PACKAGEJSON_DIR,
      resolve: localResolve,
    },
  },

  config: {
    app: {
      packageJson: APP_PACKAGEJSON_FILE,
      options: APP_NAILCONFIG_FILE,
    },
    local: {
      packageJson: LOCAL_PACKAGEJSON_FILE,
      options: require('../config/options'),
    },
  },

  protocol: process.env.HTTPS === 'true' ? 'https' : 'http',
  useYarn: fs.existsSync(appResolve('yarn.lock')),
  browserslist: APP_PACKAGEJSON_FILE.browserslist || [
    '>1%',
    'last 4 versions',
    'Firefox ESR',
    'not ie < 9',
  ],
};

module.exports = config;
