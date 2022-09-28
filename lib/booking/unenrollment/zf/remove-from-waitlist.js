const ZingfitClient = require('@dibs-tech/zingfit-client');
const { RemoveFromWaitlistError } = require('../../../errors/booking');

const zfRemoveFromWaitlist = {};
zfRemoveFromWaitlist.removeFromZingfitWaitlist = async (user, dibsTransaction) => {
  try {
    console.log(JSON.stringify(user));
    console.log(JSON.stringify(dibsTransaction));
    // const zfc = new ZingfitClient(dibsTransaction.dibs_studio.client_id, dibsTransaction.dibs_studio.client_secret, dibsTransaction.event.location.region_id);
    // await zfc.unbookSpot(dibsTransaction.waitlist_id, user.email);
  } catch (err) {
    throw new RemoveFromWaitlistError(err);
  }
};

module.exports = zfRemoveFromWaitlist;
