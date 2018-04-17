const path = require('path')
const chalk = require('chalk')
const fs = require('fs-extra')
const webpack = require('webpack')
const { getRealPath, appResolve, useYarn } = require('../lib/env-global')
const buildConfigGenerator = require('../config/webpack.build.config')
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')
const printHostingInstructions = require('react-dev-utils/printHostingInstructions')
const { measureFileSizesBeforeBuild, printFileSizesAfterBuild } = require('react-dev-utils/FileSizeReporter')
const printBuildError = require('react-dev-utils/printBuildError')

const runBuild = ({
  entry,
  outputDir,
  publicPath,
  publicDir,
  template,
  alias,
  productionSourceMap,
  parallel,
  postcssPlugins,
  env
}) => {
  const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024
  const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024

  const fullOutputDir = getRealPath(outputDir)

  const copyPublicFolder = (from, to) => {
    fs.copySync(from, to, {
      dereference: true,
      filter: file => file !== getRealPath(template)
    })
  }

  const builder = previousFileSizes => {
    console.log('Creating an optimized production build...')

    const buildConfig = buildConfigGenerator(
      entry,
      outputDir,
      publicPath,
      template,
      alias,
      postcssPlugins,
      productionSourceMap,
      parallel,
      'production'
    )

    let compiler = webpack(buildConfig)
    return new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        if (err) {
          return reject(err);
        }
        const messages = formatWebpackMessages(stats.toJson({}, true))
        if (messages.errors.length) {
          if (messages.errors.length > 1) {
            messages.errors.length = 1
          }
          return reject(new Error(messages.errors.join('\n\n')))
        }
        if (
          process.env.CI
          && (typeof process.env.CI !== 'string'
          || process.env.CI.toLowerCase() !== 'false')
          && messages.warnings.length
        ) {
          console.log(
            chalk.yellow(
              '\nTreating warnings as errors because process.env.CI = true.\n' +
              'Most CI servers set it automatically.\n'
            )
          )
          return reject(new Error(messages.warnings.join('\n\n')))
        }
        return resolve({
          stats,
          previousFileSizes,
          warnings: messages.warnings
        })
      })
    })
  }

  measureFileSizesBeforeBuild(fullOutputDir)
    .then(previousFileSizes => {
      fs.emptyDirSync(fullOutputDir)
      copyPublicFolder(getRealPath(publicDir), getRealPath(outputDir))
      return builder(previousFileSizes)
    })
    .then(
      ({ stats, previousFileSizes, warnings }) => {
        if (warnings.length) {
          console.log(chalk.yellow('Compiled with warnings.\n'))
          console.log(warnings.join('\n\n'))
          console.log(
            `\nSearch for the ${
              chalk.underline(chalk.yellow('keywords'))
            } to learn more about each warning.`
          );
          console.log(
            `To ignore, add ${
              chalk.cyan('// eslint-disable-next-line')
            } to the line before.\n`
          );
        } else {
          console.log(chalk.green('Compiled successfully.\n'))
        }

        console.log('File sizes after gzip:\n')
        printFileSizesAfterBuild(
          stats,
          previousFileSizes,
          fullOutputDir,
          WARN_AFTER_BUNDLE_GZIP_SIZE,
          WARN_AFTER_CHUNK_GZIP_SIZE
        )

        printHostingInstructions(
          require(appResolve('package.json')),
          null,
          fullOutputDir,
          path.relative(process.cwd(), fullOutputDir),
          useYarn
        )
      }
    ).catch(err => {
      console.log(chalk.red('Failed to compile.\n'))
      printBuildError(err)
      process.exit(1)
    })
}

module.exports = runBuild
