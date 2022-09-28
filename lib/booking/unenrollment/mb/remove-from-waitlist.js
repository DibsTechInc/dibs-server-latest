const MBClient = require('@dibs-tech/mindbody-client');
const { RemoveFromWaitlistError } = require('../../../errors/booking');
const Promise = require('bluebird');

const mbRemoveFromWaitlist = {};
mbRemoveFromWaitlist.removeFromMindbodyWaitlist = async (user, dibsTransaction) => {
  try {
    const mbc = new MBClient(
      process.env.MINDBODY_USERNAME,
      process.env.MINDBODY_PASSWORD,
      dibsTransaction.studioid
    );
    const { RemoveFromWaitlistResult: result } = await Promise.promisify(
      mbc.removeUserFromWaitlist,
      { context: mbc }
    )(dibsTransaction.waitlist_id);
    if (result.Status !== 'Success') {
      throw new Error('Failed to remove user from the waitlist according to Mindbody response');
    }
  } catch (err) {
    throw new RemoveFromWaitlistError(err);
  }
};

module.exports = mbRemoveFromWaitlist;
