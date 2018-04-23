const { ROOT, getRealPath } = require('../lib/env-global')

module.exports = (isDebug, modules) => {
  const base = modules.map(path => getRealPath(path))

  const hot = [
    require.resolve('react-dev-utils/webpackHotDevClient')
  ].concat(base)

  return isDebug ? hot : base
}
