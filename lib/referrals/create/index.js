const validator = require('validator');
const errorLib = require('@dibs-tech/dibs-error-handler');
const userStudioBuilder = require('../../helpers/build-user-studio');
const emailLib = require('../../emails/referrals/created');
const MailClient = require('@dibs-tech/mail-client');


/**
 * @param {Object} user the user who is making the referral
 * @param {Object} studio the referral is for (if id = 0 then its global)
 * @returns {number} amount of credit referral is worth
 */
async function getReferralAmount(user, studio) {
  let userStudio = user.userStudios ?
    user.userStudios.find(us => us.dibs_studio_id === studio.id) : null;
  if (!userStudio) {
    // find or create happens in this call
    userStudio = await userStudioBuilder.build(user, studio.id);
  }

  return userStudio.raf_amount ||
    studio.dibs_config.raf_award ||
    models.friend_referrals.GLOBAL_RAF_AWARD;
}


/**
 * @param {Object} user who is creating a referral
 * @param {number} dibsStudioId primary key of studio where referral is for
 * @param {string} rafSource were the referral is generated (e.g. 'wiget' TODO make enmerable?)
 * @param {string} email the user is referring
 * @param {string} firstName of the person the user is referring
 * @param {Object} referree the user being referred, provided when referral is created when a user signs up
 * @param {boolean} sendEmail if true sends a referral email to the address provided
 * @param {boolean} automatic true if referral is created automatically at signup
 * @param {boolean} catchError if true it catches errors and alerts ops
 *                             otherwise will throw any errors (except for AlreadyInvitedError)
 *
 * @returns {Promise<Object>} resolves API response
 */
async function createFriendReferral({
  user,
  dibsStudioId,
  rafSource,
  email = '',
  firstName = '',
  studio = null,
  referree = null,
  sendEmail = true,
  automatic = false,
  catchError = true,
}) {
  email = referree ? referree.email : email;
  firstName = referree ? referree.firstName : firstName;

  try {
    // validation is for when referrals are created on signup
    if (!user) return null;

    if (!(referree || (firstName && email))) {
      throw new Error('You must provide a referree or an email and first name.');
    }

    // validation below only applies when RAF is created using the POST route
    if ((!dibsStudioId) || isNaN(dibsStudioId)) {
      throw new Error(`Invalid Dibs studio ID: ${dibsStudioId}`);
    }
    if (!email || !validator.isEmail(email)) {
      return apiFailureWrapper({}, 'Invalid email!');
    }
    const { success } = await MailClient.validateEmail(email);
    if (!success) {
      return apiFailureWrapper({}, 'Invalid email!');
    }

    const normalizedEmail = validator.normalizeEmail(email);

    if (normalizedEmail === validator.normalizeEmail(user.email)) {
      return apiFailureWrapper(
        {}, 'You cannot refer your own email.');
    }

    studio = (studio && studio.custom_email_text && studio.dibs_config) ?
      studio
      : await models.dibs_studio.findById(dibsStudioId, {
        include: [{
          model: models.whitelabel_custom_email_text,
          as: 'custom_email_text',
          key: 'dibs_studio_id',
        },
        {
          model: models.dibs_config,
          as: 'dibs_config',
        }],
      });
    if (!studio) {
      throw new Error(`No studio with id: ${dibsStudioId}`);
    }

    referree = referree || await models.dibs_user.findOne({
      where: { email: [email.toLowerCase(), normalizedEmail] },
    });
    if (referree && (await referree.hasBookedAtStudio(dibsStudioId))) {
      return apiFailureWrapper(
        {}, `It looks like ${email} has already booked at this studio.`);
    }

    const [referral] = await sequelize.transaction(async (sqlTransaction) => {
      const referralAmount = await getReferralAmount(user, studio);
      return Promise.all([
        models.friend_referrals.createNew({
          dibsStudioId,
          referrer: user,
          referree,
          email: email.toLowerCase(),
          firstName,
          rafSource,
          method: automatic ? 'automatic' : 'refer-a-friend',
          amount: referralAmount,
          transaction: sqlTransaction,
        }),
        referree && referree.addCreditForStudio(
          referralAmount,
          studio,
          {
            save: true,
            transaction: sqlTransaction,
            creditTransactionType: models.credit_transaction.Types.REFER_A_FRIEND,
          }
        ),
      ]);
    });

    if (sendEmail) {
      emailLib.sendFriendReferralEmail(referral.id);
    }
    emailLib.sendFriendReferralTransactionsEmail(referral.id);

    return apiSuccessWrapper(
      { referral }, `Sent to ${referral.email}!`);
  } catch (err) {
    if ((!catchError) && err === models.friend_referrals.AlreadyInvitedError) {
      return null;
    }
    if (!catchError) {
      throw err;
    }
    if (err === models.friend_referrals.AlreadyInvitedError) {
      return apiFailureWrapper(
        {}, 'Someone already sent a referral to that email address!');
    }
    errorLib.handleError({
      opsSubject: 'Refer A Friend Error',
      opsIncludes: `Referred email: ${email}\nReferred name: ${firstName}\nReferred to studio: ${dibsStudioId}`,
      userid: user.id,
    })(err);
    return apiFailureWrapper({}, 'Something went wrong referring your friend');
  }
}

module.exports = { createFriendReferral };
