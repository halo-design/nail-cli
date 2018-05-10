const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const webpack = require('webpack');
const { log, copyer } = require('../utils');
const getBuildConfig = require('../config/webpack/build');
const { getRealPath, config, useYarn } = require('../env');
const printBuildError = require('../utils/devtools/printBuildError');
const formatWebpackMessages = require('../utils/devtools/formatWebpackMessages');
const printHostingInstructions = require('../utils/devtools/printHostingInstructions');
const {
  measureFileSizesBeforeBuild,
  printFileSizesAfterBuild,
} = require('../utils/devtools/FileSizeReporter');

const runBuild = opts => {
  const { publicDir, outputDir } = opts;
  const warnAfterBundleGzipSize = 512 * 1024;
  const warnAfterChunkGzipSize = 1024 * 1024;
  const fullOutputDir = getRealPath(outputDir);

  const builder = previousFileSizes => {
    log.cyan('Creating an optimized production build...');

    const compiler = webpack(getBuildConfig(opts));
    return new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        if (err) {
          return reject(err);
        }
        const messages = formatWebpackMessages(stats.toJson({}, true));
        if (messages.errors.length) {
          if (messages.errors.length > 1) {
            messages.errors.length = 1;
          }
          return reject(new Error(messages.errors.join('\n\n')));
        }
        return resolve({
          stats,
          previousFileSizes,
          warnings: messages.warnings,
        });
      });
    });
  };

  measureFileSizesBeforeBuild(fullOutputDir)
    .then(previousFileSizes => {
      fs.emptyDirSync(fullOutputDir);
      copyer(
        getRealPath(publicDir),
        getRealPath(outputDir),
        [
          getRealPath(opts.template),
          getRealPath(opts.favicon),
        ],
      );
      return builder(previousFileSizes);
    })
    .then(({ stats, previousFileSizes, warnings }) => {
      if (warnings.length) {
        log.yellow('Compiled with warnings.\n');
        console.log(warnings.join('\n\n'));
        console.log(`\nSearch for the ${
          chalk.underline(chalk.yellow('keywords'))
        } to learn more about each warning.`);
        console.log(`To ignore, add ${
          chalk.cyan('// eslint-disable-next-line')
        } to the line before.\n`);
      } else {
        log.green('Compiled successfully.\n');
      }

      console.log('File sizes after gzip:\n');
      printFileSizesAfterBuild(
        stats,
        previousFileSizes,
        fullOutputDir,
        warnAfterBundleGzipSize,
        warnAfterChunkGzipSize,
      );

      printHostingInstructions(
        config.app.packageJson,
        null,
        fullOutputDir,
        path.relative(process.cwd(), fullOutputDir),
        useYarn,
      );
    }).catch(err => {
      console.log(chalk.red('Failed to compile.\n'));
      printBuildError(err);
      process.exit(1);
    });
};

module.exports = runBuild;
