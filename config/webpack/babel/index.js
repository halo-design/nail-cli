const baseConfig = {
  babelrc: false,
  cacheDirectory: true,
  presets: [
    '@babel/preset-env',
    ['@babel/preset-stage-2', {
      decoratorsLegacy: true,
    }],
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/proposal-numeric-separator',
    '@babel/plugin-proposal-export-namespace-from',
    ['@babel/proposal-object-rest-spread', {
      useBuiltIns: true,
    }],
    ['@babel/plugin-proposal-decorators', {
      legacy: true,
    }],
    ['@babel/plugin-proposal-class-properties', {
      loose: true,
    }],
  ],
};

const finalConfig = (customConfig = {}) => ({
  ...baseConfig,
  ...customConfig,
});

module.exports = finalConfig;
