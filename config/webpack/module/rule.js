const styleLoader = require('./styleLoader');
const { reg } = require('../../../utils');
const { dir } = require('../../../env');

const setRule = ({
  assetsPath,
  lintOnSave,
  babelConfig,
  eslintConfig,
  eslintExtend,
  postcssPlugins,
}, isDebug) => {
  const assetName = isDebug
    ? '[path][name].[ext]?[hash:8]'
    : '[name].[hash:8].[ext]';

  const Loader = lang => styleLoader(lang, postcssPlugins, isDebug);

  const baseRules = [{
    test: reg.script,
    include: [dir.app.root],
    loader: 'babel-loader',
    options: require('../babel')(babelConfig),
  }, {
    test: /\.css$/,
    use: Loader(null),
  }, {
    test: /\.less$/,
    use: Loader('less-loader'),
  }, {
    test: /\.(scss|sass)$/,
    use: Loader('sass-loader'),
  }, {
    test: /\.(stylus|styl)$/,
    use: Loader('stylus-loader'),
  }, {
    test: reg.image,
    oneOf: [{
      test: /\.svg$/,
      oneOf: [{
        resourceQuery: /inline/,
        use: 'svg-inline-loader',
      }, {
        loader: 'file-loader',
        query: {
          name: `${assetsPath}images/${assetName}`,
        },
      }],
    }, {
      loader: 'url-loader',
      query: {
        limit: 4096,
        name: `${assetsPath}images/${assetName}`,
      },
    }],
  }, {
    test: reg.font,
    loader: 'url-loader',
    query: {
      limit: 8192,
      name: `${assetsPath}fonts/${assetName}`,
    },
  }, {
    test: reg.media,
    loader: 'file-loader',
    options: {
      name: `${assetsPath}media/${assetName}`,
    },
  }, {
    test: /\.txt$/,
    use: 'raw-loader',
  }];

  return {
    module: {
      rules: lintOnSave && isDebug
        ? [{
          test: reg.script,
          loader: 'eslint-loader',
          enforce: 'pre',
          include: [dir.app.src, dir.app.test],
          options: {
            formatter: require('eslint-friendly-formatter'),
            baseConfig: require('../eslint')(eslintConfig, eslintExtend, isDebug),
          },
        }].concat(baseRules)
        : baseRules,
    },
  };
};

module.exports = setRule;
