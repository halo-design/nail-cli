const { getRealPath } = require('../../../env')

const setEntry = ({ entry }, isDebug) => {
  const base = entry.map(path => getRealPath(path))

  return isDebug
    ? {
      entry: {
        app: [require.resolve('../../../utils/webpackHotDevClient')].concat(base)
      }
    } : {
      entry: {
        app: base
      }
    }
}

module.exports = setEntry
