const moment = require('moment');

module.exports = function buildPassStartDateCountMap(eventItems) {
  return eventItems.reduce((acc, item) => {
    const { passid } = item;
    const dayOfYear = moment(item.event.start_date).dayOfYear();
    if (!passid) return acc;
    if (!acc[passid]) acc[passid] = {};
    if (acc[passid][dayOfYear]) acc[passid][dayOfYear] += 1;
    else acc[passid][dayOfYear] = 1;
    return acc;
  }, {});
};
