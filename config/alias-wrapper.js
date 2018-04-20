const { isEmptyObject } = require('../lib/utils')
const { getRealPath } = require('../lib/env-global')

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