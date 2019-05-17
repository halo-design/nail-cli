const { getRealPath } = require('../../../env');
const { isEmptyObject } = require('../../../utils');

const setAlias = ({ alias }) => {
  const newAlias = {};

  Object.keys(alias).forEach(key => {
    newAlias[key] = getRealPath(alias[key]);
  });

  return isEmptyObject(newAlias) ? {} : { resolve: { alias: newAlias } };
};

module.exports = setAlias;
