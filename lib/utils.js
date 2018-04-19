exports.isEmptyObject = obj => {
  for (let name in obj) {
    return false
  }
  return true
}

exports.getFileName = s => s.substring(s.lastIndexOf('/') + 1)
