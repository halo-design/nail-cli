const { getRealPath } = require('../../../env');
const { isEmptyObject } = require('../../../utils');

const setAlias = ({ alias }) => {
  const newAlias = {};

  for (let key in alias) {
    newAlias[key] = getRealPath(alias[key]);
  }

  return isEmptyObject(newAlias) ? {} : { resolve: { alias: newAlias } };
};

module.exports = setAlias;
