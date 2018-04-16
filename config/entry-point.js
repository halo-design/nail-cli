const { ROOT, getRealPath, env } = require('../lib/env-global')

module.exports = modules => {
  const base = modules.map(path => getRealPath(path))

  const hot = [
    require.resolve('webpack-dev-server/client'),
    require.resolve('webpack/hot/dev-server')
  ].concat(base)

  return env.debug ? hot : base
}
