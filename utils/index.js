const reg = require('./reg')
const chalk = require('chalk')
const fs = require('fs-extra')
const styleLoader = require('./style-loader')

exports.reg = reg
exports.styleLoader = styleLoader

exports.isEmptyObject = obj => {
  for (let name in obj) return false
  return true
}

exports.getFileName = s =>
  s.substring(s.lastIndexOf('/') + 1)

exports.removeLastSlash = s =>
  s.substring(0, s.lastIndexOf('/'))

exports.copyer = (from, to, exclude) => {
  exclude = exclude || []
  fs.copySync(from, to, {
    dereference: true,
    filter: file => exclude.every(item => item !== file)
  })
}

let log = {}
const colorList = ['red', 'blue', 'cyan', 'green', 'white', 'yellow', 'magenta', 'gray']
colorList.forEach(item => {
  const type = item === 'gray' ? item : `${item}Bright`
  log[item] = info => {
    console.log(chalk[type](info))
  }
})

exports.log = log
