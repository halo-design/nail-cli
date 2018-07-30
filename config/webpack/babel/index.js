const baseConfig = {
  babelrc: false,
  cacheDirectory: true,
  ...require('./common'),
};

const finalConfig = (customConfig = {}) => ({
  ...baseConfig,
  ...customConfig,
});

module.exports = finalConfig;
