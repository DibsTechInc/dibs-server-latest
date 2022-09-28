const MailClient = require('@dibs-tech/mail-client');
const { format: formatCurrency } = require('currency-formatter');
const Promise = require('bluebird');
const { handleError } = require('@dibs-tech/dibs-error-handler');


const mc = new MailClient();
const sendTemplatedEmail =
  Promise.promisify(mc.sendTemplatedEmail, { context: mc });

/**
 * @param {number|string} referralId the id of the referral to send an email for
 * @returns {Promise<undefined>} sends email to referrer's email address
 */
module.exports = async function sendEmail(referralId) {
  try {
    const referral = await models.friend_referrals.findById(referralId, {
      include: [{
        model: models.dibs_studio,
        as: 'studio',
        include: [{
          model: models.whitelabel_custom_email_text,
          as: 'custom_email_text',
        }, {
          model: models.dibs_config,
          as: 'dibs_config',
        }],
      }, {
        model: models.dibs_user,
        as: 'referringUser',
      }, {
        model: models.dibs_user,
        as: 'referredUser',
      }],
    });
    const emailData = mc.getEmailDataForStudio(
      referral.studio, MailClient.EmailTypes.REFERRAL_COMPLETED);

    emailData.referredName =
      `${referral.referredUser.firstName} ${referral.referredUser.lastName}`;
    emailData.referringName =
      `${referral.referringUser.firstName} ${referral.referringUser.lastName}`;
    emailData.creditAmount = formatCurrency(
      referral.amount, { code: referral.studio.currency });
    emailData.template = 'white-label/notify-studio-friend-referral-completion';
    await sendTemplatedEmail(
      referral.studio.billing_email,
      'Redeemed Friend Referral Notification',
      'white-label/notify-studio-friend-referral-completion',
      emailData,
      {
        force: true,
        from: {
          name: 'Dibs Friend Referrals',
          email: 'no-reply@ondibs.com',
        },
      }
    );
  } catch (err) {
    handleError({
      opsSubject: 'Studio Notification Friend Referral Completed Email Error',
      opsIncludes: `Referral ID: ${referralId}`,
    })(err);
  }
};
