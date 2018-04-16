const { resolve } = require('path')

const APP_ROOT = resolve()
const LOCAL_ROOT = resolve(__dirname, '..')
const localResolve = args => resolve(LOCAL_ROOT, args)
const appResolve = args => resolve(APP_ROOT, args)
const getRealPath = path => 
  path.indexOf('<rootDir>/') > -1
    ? appResolve(path.replace('<rootDir>/', ''))
    : require.resolve(path)

module.exports = {
  ROOT: {
    LOCAL: LOCAL_ROOT,
    APP: APP_ROOT
  },
  localResolve,
  appResolve,
  getRealPath,
  is: {
    release: process.argv.includes('--release'),
    verbose: process.argv.includes('--verbose'),
    analyze: process.argv.includes('--analyze') || process.argv.includes('--analyse')
  },
  browserslist: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9'],
  env: {
    debug: process.env.NODE_ENV !== 'production'
  }
}