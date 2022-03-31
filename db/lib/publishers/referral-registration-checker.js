// const jackrabbit = require('jackrabbit');

// module.exports = function publishReferralChecker({ id, email, createdAt }) {
//   const rabbit = jackrabbit(process.env.CLOUDAMQP_URL || 'amqp://localhost:5672');
//   const exchange = rabbit.default();

//   exchange.queue({ name: 'referralRegistrationCheck', durable: true, autoDelete: true });
//   exchange.publish({ id, email, createdAt }, { key: 'referralRegistrationCheck' })
//     .on('drain', rabbit.close);
// };
