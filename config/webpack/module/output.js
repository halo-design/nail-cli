const path = require('path')
const { getRealPath } = require('../../../env')

const setOutPut = ({
  outputDir,
  publicPath,
  assetsPath
}, isDebug) => ({
  output: {
    path: getRealPath(outputDir),
    publicPath,
    pathinfo: true,
    filename: isDebug 
      ? '[name].js'
      : `${assetsPath}js/[name].[chunkhash:8].min.js`,

    chunkFilename: isDebug
      ? '[name].chunk.js'
      : `${assetsPath}js/[name].[chunkhash:8].chunk.min.js`,

    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
  }
})

module.exports = setOutPut
