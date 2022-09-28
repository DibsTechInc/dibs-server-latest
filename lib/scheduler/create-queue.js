const { createQueue } = require('kue');
const onScheduleFlashCredits = require('./jobs/schedule-flash-credits');

/**
 * createScheduledJobQueue
 * @returns {kue.Queue} an instance of kue's Queue class
 */
function createScheduledJobQueue() {
  const queue = createQueue({
    redis: process.env.NODE_ENV === 'production' ?
      process.env.REDISCLOUD_URL
      : 'redis://127.0.0.1:6379',
  });
  queue.process('schedule-flash-credits', onScheduleFlashCredits);
  return queue;
}

if (require.main === module) createScheduledJobQueue();
else module.exports = createScheduledJobQueue;
