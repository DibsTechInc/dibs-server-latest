const jackrabbit = require('jackrabbit');

module.exports = function publishEmailNotification(userid, type) {
  const rabbit = jackrabbit(process.env.CLOUDAMQP_URL || 'amqp://localhost:5672');
  const exchange = rabbit.default();
  exchange.queue({ name: 'emailNotifier', durable: true, autoDelete: true });

  exchange.publish({ userid, type }, { key: 'emailNotifier' })
  .on('drain', rabbit.close);
};
