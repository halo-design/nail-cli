const { createTransformer } = require('babel-jest');
const babelConfig = require('../../webpack/babel/common');

module.exports = createTransformer({
  ...babelConfig,
  babelrc: false,
});
