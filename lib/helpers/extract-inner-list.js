const { uniqBy, uniq } = require('lodash');

/**
 *
 * @param {array<object>} outterArray array of objects
 * @param {string} innerKey key to look for and create array of
 * @param {string} [uniqByKey] optional key to use when determining uniquness of inner array
 * @returns {array} inner array
 */
module.exports = function extractInnerList(outterArray, innerKey, uniqByKey) {
  const innerArray = outterArray.map(obj => obj[innerKey]);
  return uniqByKey ? uniqBy(innerArray, uniqByKey) : uniq(innerArray);
};
