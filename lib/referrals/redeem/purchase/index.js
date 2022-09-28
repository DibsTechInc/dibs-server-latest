const errorLib = require('@dibs-tech/dibs-error-handler');
const { Op } = require('sequelize');
const emailLib = require('../../../emails/referrals/completed');
const Promise = require('bluebird');


/**
 * @param {Object} dibsTransaction which we use check to see if a referred person made their first purchase
 *
 * @returns {Promise<undefined>} adds credit to the referrer's account,
 *                               this one catches any errors and sends an alert to ops
 */
async function redeemReferralOnPurchase(dibsTransaction) {
  try {
    const referral = await models.friend_referrals.findOne({
      where: {
        referredUserId: dibsTransaction.userid,
        referredTransactionId: null,
        createdAt: {
          [Op.gt]: models.friend_referrals.referralCreditValidDate(),
        },
        dibs_studio_id: dibsTransaction.dibs_studio_id,
      },
      include: [{
        model: models.dibs_user,
        as: 'referringUser',
      }, {
        model: models.dibs_user,
        as: 'referredUser',
      }, {
        model: models.dibs_studio,
        as: 'studio',
      }],
    });
    if (!referral) return;
    await sequelize.transaction(async (sqlTransaction) => {
      const referralTransaction =
        models.dibs_transaction.newFriendReferralTransaction({
          referral,
          save: true,
          transaction: sqlTransaction,
        });
      return Promise.all([
        referral.referringUser.addCreditForStudio(
          referral.amount,
          referral.studio,
          {
            save: true,
            transaction: sqlTransaction,
            associatedTransactionId: referralTransaction.id,
            creditTransactionType: models.credit_transaction.Types.REFER_A_FRIEND,
          }
        ),
        referral.update(
          {
            creditsAwarded: referral.amount,
            referredTransactionId: dibsTransaction.id,
            referralAcceptedAt: new Date(),
          },
          { transaction: sqlTransaction }
        ),
      ]);
    });
    emailLib.sendFriendReferralCompletedEmail(referral.id);
    emailLib.sendTransactionsEmail(referral.id);
    emailLib.sendStudioReferralCompletedEmail(referral.id);
  } catch (err) {
    errorLib.handleError({
      opsSubject: 'Check Referral Transaction Error',
      userid: dibsTransaction.userid,
      opsIncludes: `Referral was redeemed with transaction ${dibsTransaction.id}.`,
    })(err);
  }
}


/**
 * @param {Array<Object>} dibsTransactions array of dibsTransactions being checked out
 * @returns {Promise<Array<undefined>>} redeems any
 */
module.exports = function checkTransactionsForReferrals(dibsTransactions) {
  return Promise.each(
    dibsTransactions.map(redeemReferralOnPurchase));
};
