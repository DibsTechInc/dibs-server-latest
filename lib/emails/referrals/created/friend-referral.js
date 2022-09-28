const MailClient = require('@dibs-tech/mail-client');
const Promise = require('bluebird');
const { format: formatCurrency } = require('currency-formatter');
const { handleError } = require('@dibs-tech/dibs-error-handler');


const mc = new MailClient();
const sendTemplatedEmail =
  Promise.promisify(mc.sendTemplatedEmail, { context: mc });


/**
 * @param {Object} referral to get signup link for
 * @returns {string} signup link for referral email
 */
function getSignupLink(referral) {
  const fromWidget = referral.raf_source === 'widget';
  const fromMobileApp = referral.raf_source === 'mobile-app';
  const widgetQuery = '?dibs_open&dibs_nav=profile';
  const userSignupRoute = '/users/signup';

  if (process.env.NODE_ENV === 'development' && fromWidget) {
    return `http://localhost:2999/${widgetQuery}`;
  }

  if (process.env.NODE_ENV === 'development') {
    return `http://localhost:${process.env.PORT || 3000}${userSignupRoute}`;
  }

  if (fromWidget) {
    return `http://${referral.studio.domain}${widgetQuery}`;
  }

  // Send mobile app raf to mobile widget for now. Change later.
  if (fromMobileApp) {
    return `http://${referral.studio.domain}${widgetQuery}`;
  }

  return `https://www.ondibs.com${userSignupRoute}`;
}

/**
 * @param {number|string} referralId the id of the referral to send an email for
 * @returns {Promise<undefined>} sends email to referred email address
 */
module.exports = async function sendFriendReferralEmail(referralId) {
  try {
    const referral = await models.friend_referrals.findById(referralId, {
      include: [{
        model: models.dibs_studio,
        as: 'studio',
        include: [{
          model: models.dibs_config,
          as: 'dibs_config',
        }],
      }, {
        model: models.dibs_user,
        as: 'referringUser',
        attributes: ['firstName', 'lastName'],
      }],
    });

    if (!(referral.studio && referral.studio.id)) {
      throw new Error(
        `Referral with ID: ${referralId} does not have an associated studio.`);
    }

    const emailData = mc.getEmailDataForStudio(
      referral.studio, MailClient.EmailTypes.REFER_A_FRIEND);

    emailData.referrerName = `${referral.referringUser.firstName} ${referral.referringUser.lastName}`;
    emailData.referredName = referral.firstName;
    emailData.referredEmail = referral.email;
    emailData.creditAmount = formatCurrency(
      referral.amount, { code: referral.studio.currency, precision: 0 });
    emailData.signupLink = getSignupLink(referral);
    await sendTemplatedEmail(
      referral.email,
      `${referral.studio.name} Friend Referral`,
      emailData.template,
      emailData,
      {
        force: true,
        pool: 'transactional',
        from: {
          name: emailData.studioName,
          email: emailData.domain,
        },
      }
    );
    // notify the studio that friend referral was made
    emailData.template = 'white-label/notify-studio-friend-referral';
    await sendTemplatedEmail(
      referral.studio.billing_email,
      'New Friend Referral',
      'white-label/notify-studio-friend-referral',
      emailData,
      {
        force: true,
        pool: 'transactional',
        from: {
          name: 'Dibs Friend Referrals',
          email: 'no-reply@ondibs.com',
        },
      }
    );
  } catch (err) {
    handleError({
      opsSubject: 'Friend Referral Created Email Error',
      opsIncludes: `Referral ID: ${referralId}`,
    })(err);
  }
};
