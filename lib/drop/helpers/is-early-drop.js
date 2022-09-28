const enums = require('./enums');
const moment = require('moment-timezone');

/**
 * @param {Object} studio used for mainTZ and cancel_time settings
 * @param {string} startTime of the event
 * @param {enum} earlyLateDropOverride customizable for studio admin
 * @returns {boolean} if the drop is an early drop
 */
module.exports = function isEarlyDrop({ studio, startTime, earlyLateDropOverride, now = moment() }) {
  const cancelTime = studio.cancel_time || 12;
  const eventStart = moment.tz(moment.utc(startTime).format('YYYY-MM-DDTHH:mm:ss'), studio.mainTZ);
  const lateCancel = eventStart < now.clone().add(cancelTime, 'h');
  const forceEarly = earlyLateDropOverride === enums.EarlyDropOverrideValues.EARLY;
  const noOverride = earlyLateDropOverride === enums.EarlyDropOverrideValues.NONE;
  return forceEarly || (noOverride && !lateCancel);
};
