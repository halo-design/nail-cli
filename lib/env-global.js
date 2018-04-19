const fs = require('fs')
const { resolve } = require('path')

const APP_ROOT = resolve()
const LOCAL_ROOT = resolve(__dirname, '..')
const localResolve = args => resolve(LOCAL_ROOT, args)
const appResolve = args => resolve(APP_ROOT, args)
const getRealPath = file => 
  file.indexOf('<rootDir>/') > -1
    ? appResolve(file.replace('<rootDir>/', ''))
    : require.resolve(file)

const useYarn = fs.existsSync(appResolve('yarn.lock'))

module.exports = {
  ROOT: {
    LOCAL: LOCAL_ROOT,
    APP: APP_ROOT
  },
  APP_PACKAGE_JSON: appResolve('package.json'),
  APP_SRC_DIR: appResolve('src'),
  APP_TEST_DIR: appResolve('test'),
  localResolve,
  appResolve,
  getRealPath,
  is: {
    release: process.argv.includes('--release'),
    verbose: process.argv.includes('--verbose'),
    analyze: process.argv.includes('--analyze') || process.argv.includes('--analyse')
  },
  useYarn,
  browserslist: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9'],
  env: {
    debug: () => process.env.NODE_ENV !== 'production'
  }
}