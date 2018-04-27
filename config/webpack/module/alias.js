const { getRealPath } = require('../../../env')
const { isEmptyObject } = require('../../../utils')

const setAlias = ({ alias }) => {
  let newAlias = {}

  for (let key in alias) {
    newAlias[key] = getRealPath(alias[key])
  }

  return isEmptyObject(newAlias) ? {} : { resolve: { alias: newAlias } }
}

module.exports = setAlias
