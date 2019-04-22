const { getRealPath } = require('../../../env');
const { writeJSON } = require('../../../utils');

const createBaseConfig = eslintExtend => {
  eslintExtend = eslintExtend || 'standard';
  const config = require(`./${eslintExtend}`);
  return config;
};

const finalConfig = (customConfig = {}, eslintExtend, isDebug) => {
  const config = {
    ...createBaseConfig(eslintExtend),
    ...customConfig,
  }
  writeJSON(config, getRealPath('<rootDir>/.eslintrc'));

  return {
    ...config,
    ...{ 'no-debugger': isDebug ? 0 : 2 }
  }
};


module.exports = finalConfig;
