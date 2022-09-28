const { createQueue } = require('kue');
const moment = require('moment');

// Will use existing one if already exists
const queue = createQueue({
  redis: process.env.NODE_ENV === 'production' ?
    process.env.REDISCLOUD_URL
    : 'redis://127.0.0.1:6379',
});
/**
 * publishScheduledJob
 * @param {string} name of the job, how queue.js knows which handler to use
 * @param {Object} data data to send to the handler of the job
 * @param {string|Date} [time=''] when the job should run, default is immediately
 * @returns {undefined}
 */
function publishScheduledJob(name, data, time) {
  const delay = time ? moment(time).toDate() : 0;
  queue.create(name, data)
       .delay(delay)
       .removeOnComplete(true)
       .save();
}

module.exports = publishScheduledJob;
