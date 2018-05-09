const { createTransformer } = require('babel-jest');

module.exports = createTransformer({
  presets: [
    require.resolve('@babel/preset-env'),
    [require.resolve('@babel/preset-stage-2'), {
      decoratorsLegacy: true,
    }],
    require.resolve('@babel/preset-react'),
  ],
  babelrc: false,
});
