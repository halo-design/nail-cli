#!/usr/bin/env node
const fs = require('fs')
const chalk = require('chalk')
const envPath = require('../lib/env-path')
const configPath = envPath.projectResolve('nail.config.js')

console.log(envPath.DIR.ROOT)
console.log(envPath.DIR.PROJECT)

console.log(envPath.resolve('lib/index.js'))
console.log(process.argv.includes("dev"))

if (fs.existsSync(configPath)) {
  const userConfig = require(configPath)
  console.log(userConfig)
} else {
  console.log(chalk.red('The configuration file "nail.config.js" does not exist.'))
}