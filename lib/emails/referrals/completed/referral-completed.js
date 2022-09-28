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
    emailData.creditAmount = formatCurrency(
      referral.amount, { code: referral.studio.currency });
    emailData.bookNow = referral.raf_source === 'widget' ?
      `http://${referral.studio.domain}?dibs_open`
      : 'https://www.ondibs.com/users/dashboard/fitness';

    await sendTemplatedEmail(
      referral.referringUser.email,
      `${referral.studio.name} Friend Referral Credit Added`,
      emailData.template,
      emailData,
      {
        force: true,
        from: {
          name: emailData.studioName,
          email: emailData.domain,
        },
      }
    );
  } catch (err) {
    handleError({
      opsSubject: 'Friend Referral Completed Email Error',
      opsIncludes: `Referral ID: ${referralId}`,
    })(err);
  }
};
