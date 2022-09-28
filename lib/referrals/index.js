const { createFriendReferral } = require('./create');


/* eslint-disable global-require */
module.exports = {
  createFriendReferral,
  redeemReferralOnSignup: require('./redeem/signup'),
  checkTransactionsForReferrals: require('./redeem/purchase'),
};
