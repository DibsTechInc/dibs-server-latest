/* eslint-disable global-require */
module.exports = {
  sendAutopayPaymentFailedEmail: require('./autopay-payment-failed'),
  sendAutopayUpcomingEmail: require('./autopay-upcoming'),
  sendAutopaySuccessEmail: require('./autopay-success'),
  sendAutopayTransactionsEmail: require('./transactions'),
};
