/* eslint-disable global-require */
module.exports = {
  sendConfirmationEmail: require('./confirmation'),
  sendSpotBookingEmail: require('./spots'),
  sendTransactionsEmail: require('./transactions'),
};
