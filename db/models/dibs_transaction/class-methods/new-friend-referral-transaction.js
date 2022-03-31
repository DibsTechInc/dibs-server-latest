/**
 * @param {Object} referral the instance of the referral being redeemed at purchase
 * @param {boolean} save if true saves the new transaction instance to the database
 * @param {Object} transaction SQL transaction
 *
 * @returns {Promise<Object>} new friend referral instance
 */
module.exports = async function newFriendReferralTransaction({
  referral,
  save = false,
  transaction = undefined,
} = {}) {
  if (!referral.studio) {
    throw new Error(
      'Friend referral does not have an associated studio.');
  }
  let instance = this.build({
    userid: referral.referredUserId,
    type: this.Types.REFER_A_FRIEND_CREDIT,
    amount: referral.amount,
    status: 1,
    description: `Friend referral award of ${referral.amount} credit`,
    source: referral.studio.source,
    studioid: referral.studio.studioid,
    dibs_studio_id: referral.dibs_studio_id,
    original_price: 0,
    tax_amount: 0,
  });
  if (!save) return instance;
  instance = await instance.save(
    transaction ? { transaction } : undefined);
  return instance;
};
