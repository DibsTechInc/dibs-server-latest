const jackrabbit = require('jackrabbit');
/**
 *
 * @param {integer} eventid   event identifier
 * @param {integer} dibsStudioId  studio identifier
 * @param {array<object>} visits  mindbody visits object
 * @returns {undefined}
 */
function singleClassAttendeeUpdater(eventid, dibsStudioId, visits) {
  if (!visits) return;
  const rabbit = jackrabbit(process.env.CLOUDAMQP_URL || 'amqp://localhost:5672');
  const exchange = rabbit.default();

  exchange.queue({ name: 'singleClassAttendeeUpdater', durable: true, autoDelete: true });
  exchange.publish({ eventid, dibsStudioId, visits }, { key: 'singleClassAttendeeUpdater' })
    .on('drain', rabbit.close);
}


module.exports = { publish: singleClassAttendeeUpdater };
