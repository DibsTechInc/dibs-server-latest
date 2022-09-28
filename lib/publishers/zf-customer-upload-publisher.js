const jackrabbit = require('jackrabbit');

module.exports = function publishZFCustomers(data, dibsStudioId) {
  const rabbit = jackrabbit(process.env.CLOUDAMQP_URL || 'amqp://127.0.0.1:5672');
  const exchange = rabbit.default();
  exchange.queue({ name: 'zfUploader', durable: true, autoDelete: true });
  exchange.publish({ data, dibsStudioId }, { key: 'zfUploader' })
    .on('drain', rabbit.close);
};
