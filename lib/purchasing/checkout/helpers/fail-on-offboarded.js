const moment = require('moment');
const purchaseErrorLib = require('../../../errors/purchasing');
/**
 * @param {object} studio instance of dibs_studio model
 * @param {string} studio.offboard_at  date studio will offboard
 * @param {string} studio.name studio name
 * @returns {null} null or throw error
 */
module.exports = function failOnOffboarded({ offboard_at, name }) {
  if (!offboard_at || moment().isBefore(offboard_at)) return null;
  throw new purchaseErrorLib.CartError(`Cart includes an offboarded studio: ${name}`);
};
