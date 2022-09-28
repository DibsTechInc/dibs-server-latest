/* eslint-disable global-require */
module.exports = {
  sendBookingConfirmationEmail: require('./confirmation'),
  sendBookingTransactionsEmail: require('./transactions'),
  sendBookingSpotsEmail: require('./spots'),
};
