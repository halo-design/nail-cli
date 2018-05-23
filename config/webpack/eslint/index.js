const { getRealPath } = require('../../../env');
const { writeJSON } = require('../../../utils');

const createBaseConfig = eslintExtend => {
  eslintExtend = eslintExtend || 'standard';
  const config = require(`./${eslintExtend}`);
  writeJSON(config, getRealPath('<rootDir>/.eslintrc'));
  return config;
};

const finalConfig = (customConfig = {}, eslintExtend, isDebug) => ({
  ...createBaseConfig(eslintExtend),
  ...{ 'no-debugger': isDebug ? 0 : 2 },
  ...customConfig,
});

module.exports = finalConfig;
