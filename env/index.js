const fs = require('fs')
const chalk = require('chalk')
const { resolve } = require('path')
const { log } = require('../utils')

const APP_ROOT = resolve()
const LOCAL_ROOT = resolve(__dirname, '..')

const appResolve = args => resolve(APP_ROOT, args)
const localResolve = args => resolve(LOCAL_ROOT, args)

const getRealPath = file => 
  file.indexOf('<rootDir>/') > -1
    ? appResolve(file.replace('<rootDir>/', ''))
    : require.resolve(file)

const LOCAL_PACKAGEJSON_DIR = localResolve('package.json')
const LOCAL_PACKAGEJSON_FILE = require(LOCAL_PACKAGEJSON_DIR)

const APP_SRC_DIR = appResolve('src')
const APP_TEST_DIR = appResolve('test')
const APP_PACKAGEJSON_DIR = appResolve('package.json')
const APP_NAILCONFIG_DIR = appResolve('nail.config.js')

let APP_PACKAGEJSON_FILE
if (fs.existsSync(APP_PACKAGEJSON_DIR)) {
  APP_PACKAGEJSON_FILE = require(APP_PACKAGEJSON_DIR)
} else {
  APP_PACKAGEJSON_FILE = {}
  log.red('\nThe file "package.json" does not exist.\n')
  process.exit(1)
}

let APP_NAILCONFIG_FILE
if (fs.existsSync(APP_NAILCONFIG_DIR)) {
  APP_NAILCONFIG_FILE = require(APP_NAILCONFIG_DIR)
} else {
  APP_NAILCONFIG_FILE = {}
  log.yellow('\nThe configuration file "nail.config.js" does not exist.\n')
}

const config = {
  getRealPath,

  dir : {
    app: {
      root: APP_ROOT,
      src: APP_SRC_DIR,
      test: APP_TEST_DIR,
      nailConfig: APP_NAILCONFIG_DIR,
      packageJson: APP_PACKAGEJSON_DIR,
      resolve: appResolve
    },
    local: {
      root: LOCAL_ROOT,
      packageJson: LOCAL_PACKAGEJSON_DIR,
      resolve: localResolve
    }
  },

  config: {
    app: {
      packageJson: APP_PACKAGEJSON_FILE,
      options: APP_NAILCONFIG_FILE
    },
    local: {
      packageJson: LOCAL_PACKAGEJSON_FILE,
      options: require('../config/options')
    }
  },

  protocol: process.env.HTTPS === 'true' ? 'https' : 'http',
  useYarn: fs.existsSync(appResolve('yarn.lock')),
  browserslist:
    APP_PACKAGEJSON_FILE.browserslist
    || ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9']
}

module.exports = config