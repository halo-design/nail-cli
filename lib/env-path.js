const path = require('path')

const PROJECT_ROOT_DIR = path.resolve()
const ROOT_DIR = path.resolve(__dirname, '..')

module.exports = {
  DIR: {
    ROOT: ROOT_DIR,
    PROJECT: PROJECT_ROOT_DIR
  },
  resolve: (...args) => path.resolve(ROOT_DIR, ...args),
  projectResolve: (...args) => path.resolve(PROJECT_ROOT_DIR, ...args),
  is: {
    release: process.argv.includes('--release'),
    verbose: process.argv.includes('--verbose'),
    analyze: process.argv.includes('--analyze') || process.argv.includes('--analyse'),
    production: process.env.NODE_ENV === 'production'
  }
}