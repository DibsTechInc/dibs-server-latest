const MailClient = require('@dibs-tech/mail-client');
const Promise = require('bluebird');
const { handleError } = require('@dibs-tech/dibs-error-handler');


const mc = new MailClient();
const sendTransactionsEmail = Promise.promisify(mc.transactions, { context: mc });


module.exports = async function sendFriendReferralCompletedTransactionEmail(referralId) {
  try {
    const referral = await models.friend_referrals.findById(referralId, {
      include: [{
        model: models.dibs_studio,
        as: 'studio',
        attributes: ['name'],
      }, {
        model: models.dibs_user,
        as: 'referringUser',
        attributes: ['id'],
      }, {
        model: models.dibs_user,
        as: 'referredUser',
        attributes: ['id'],
      }],
    });
    await sendTransactionsEmail(
      `${referral.studio.name} Friend Referral Purchase`,
      `Referred user: ${referral.referredUser.id} has purchased their first class. `
        + `They were referred by ${referral.referringUser.id}!`
    );
  } catch (err) {
    handleError({
      opsSubject: 'Friend Referral Completed Transaction Error',
      opsIncludes: `Referral ID: ${referralId}`,
    })(err);
  }
};
