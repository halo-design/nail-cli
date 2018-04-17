const { getRealPath } = require('../lib/env-global')
const { isEmptyObject } = require('../lib/utils')

module.exports = (config, aliasMap) => {
  let newAlias = {}
  for (let key in aliasMap) {
    newAlias[key] = getRealPath(aliasMap[key])
  }

  if (!isEmptyObject(newAlias)) {
    config.resolve.alias = newAlias
  }
  return config
}