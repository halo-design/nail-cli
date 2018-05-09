const { getRealPath } = require('../../../env')
const { writeJSON } = require('../../../utils')

const createBaseConfig = eslintType => {
  eslintType = eslintType || 'standard'
  const config = require(`./${eslintType}`)
  writeJSON(config, getRealPath('<rootDir>/.eslintrc'))
  return config
}

finalConfig = (customConfig = {}, eslintType, isDebug) => ({
  ...createBaseConfig(eslintType),
  ...{ 'no-debugger': isDebug ? 0 : 2 },
  ...customConfig
})

module.exports = finalConfig
