const MailClient = require('@dibs-tech/mail-client');
const Promise = require('bluebird');
const { handleError } = require('@dibs-tech/dibs-error-handler');


const mc = new MailClient();
const sendTransactionsEmail = Promise.promisify(mc.transactions, { context: mc });


module.exports = async function sendFriendReferralTransactionsEmail(referralId) {
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
      }],
    });
    await sendTransactionsEmail(
      `${referral.studio.name} Referral`,
      `User: ${referral.referringUser.id} has referred ${referral.email} to ${referral.studio.name} (Dibs ID: ${referral.dibs_studio_id}).`);
  } catch (err) {
    handleError({
      opsSubject: 'Friend Referral Created Transaction Error',
      opsIncludes: `Referral ID: ${referralId}`,
    })(err);
  }
};
