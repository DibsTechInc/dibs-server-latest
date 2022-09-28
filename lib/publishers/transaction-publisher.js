const jackrabbit = require('jackrabbit');

/**
 * publishTransactions
 * @param {number|Array<number>} _transactionIds either a transaction id (num) or array of transaction ids
 * @returns {undefined}
 */
function publishTransactions(_transactionIds) {
  if (process.env.NODE_ENV !== 'production') return null;
  let transactionIds;
  if (typeof _transactionIds === 'number') transactionIds = [_transactionIds];
  else transactionIds = _transactionIds;

  const rabbit = jackrabbit(process.env.CLOUDAMQP_URL || 'amqp://localhost:5672');
  const exchange = rabbit.default();
  exchange.queue({ name: 'transactionCalculator', durable: true, autoDelete: true });

  exchange.publish({ transactionIds }, { key: 'transactionCalculator' })
          .on('drain', rabbit.close);
  return null;
}

/**
 * transactionReferallCheck - Description
 *
 * @param {type} transactions Description
 *
 * @returns {type} Description
 */
function publishTransactionReferralCheck(transactions) {
  if (process.env.NODE_ENV !== 'production' && !process.env.TEST_REFERRALS) return null;
  const rabbit = jackrabbit(process.env.CLOUDAMQP_URL || 'amqp://localhost:5672');
  const exchange = rabbit.default();
  exchange.queue({ name: 'referralTransactionCheck', durable: true, autoDelete: true });

  transactions.map(({ id, userid }) =>
    exchange.publish({ id, userid }, { key: 'referralTransactionCheck' })
            .on('drain', rabbit.close)
  );
  return null;
}

module.exports = {
  publishTransactions,
  publishTransactionReferralCheck,
};
