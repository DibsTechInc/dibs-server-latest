const jackrabbit = require('jackrabbit');

/**
 * @param {object} dropObj  drop information
 * @param {number} dropObj.dibsStudioId studio identifier
 * @param {string} dropObj.classid class identifer
 * @param {array<string>} dropObj.visitIds  list of visits that were dropped
 * @param {boolean} dropObj.early  whether the drop was early or late
 * @returns {undefined}
 */
function publish(dropObj) {
  const rabbit = jackrabbit(process.env.CLOUDAMQP_URL || 'amqp://localhost:5672');
  const exchange = rabbit.default();
  exchange.queue({ name: 'offsiteDrop', durable: true, autoDelete: true });

  exchange.publish(dropObj, { key: 'offsiteDrop' })
    .on('drain', rabbit.close);
}

module.exports = { publish };
