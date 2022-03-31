const moment = require('moment-timezone');

/**
 * Sorts events into upcoming and past events
 * @param {array} rawData the events array
 *
 * @returns {object} the events, separated
 */
function run(rawData, { cutoff = moment() } = {}) {
  const data = {};
  data.upcoming = rawData
    .filter((item) => {
      const now = cutoff.clone();
      return moment(item.start_time).toDate() > now.subtract(10, 'minutes').toDate();
    })
    .sort((a, b) => moment(a.start_time) - moment(b.start_time));
  data.past = rawData
    .filter((item) => {
      const now = cutoff.clone();
      return moment(item.start_time).toDate() <= now.subtract(10, 'minutes').toDate();
    })
    .sort((a, b) => moment(b.start_time) - moment(a.start_time));

  return data;
}

module.exports = {
  run,
};
