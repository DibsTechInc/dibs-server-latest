const mbUnenrollment = require('./mb/unenroll');
const zfUnenrollment = require('./zf/unenroll');

const mbRemoveFromWaitlist = require('./mb/remove-from-waitlist');
const zfRemoveFromWaitlist = require('./zf/remove-from-waitlist');

module.exports = {
  /**
   * @param {Object} user to unenroll
   * @param {Object} studio to unenroll
   * @param {Array<Object>} transactions object with event & pass we are attempting to unenroll a client from
   * @param {Array<Object>} sales objects (used for Zingfit) contains a saleId and regionId
   * @param {Boolean} clientid optional to pass through (if user has a pass w diff clientid)
   * @param {early} early or late cancel, default to true
   * @returns {Promise<undefined>} if the user is successfully unenrolled from the events, error otherwise
   */
  unenrollUserFromEvents({
    user,
    studio,
    transactions,
    sales,
    early = true,
    clientid,
  }) {
    switch (studio.source) {
      case 'mb':
        return mbUnenrollment.unenrollUserFromMindbodyEvents({
          user,
          studio,
          transactions,
          early,
          clientid,
        });
      case 'zf':
        return zfUnenrollment.unenrollUserFromZingfitEvents({
          user,
          studio,
          sales,
          early,
        });
      case 'pt':
        return null; // TODO
      default:
        throw new Error(`Studio ${studio.id} has an invalid source.\n\n User: ${user.id}.\n\n Transactions: ${transactions.map(t => t.id).join(', ')}`);
    }
  },

  /**
   * @param {Object} user to remove from the waitlist
   * @param {Object} dibsTransaction waitlist transaction that was created
   *                                 when they were added
   * @returns {Promise<undefined>} removes them from the waitlist
   */
  removeFromWaitlist(user, dibsTransaction) {
    switch (dibsTransaction.source) {
      case 'mb':
        return mbRemoveFromWaitlist.removeFromMindbodyWaitlist(user, dibsTransaction);
      case 'zf':
        return;
        // return zfRemoveFromWaitlist.removeFromZingfitWaitlist(user, dibsTransaction);
      default:
        throw new Error(`Dibs transaction ${dibsTransaction.id} has an invalid source for waitlist removal`);
    }
  },
};
