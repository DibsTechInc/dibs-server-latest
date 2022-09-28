const validator = require('validator');
const { Op } = require('sequelize');
const createLib = require('../../create');


/**
 * @param {Object} referree dibs_user who was referred
 * @param {Object} studio dibs_studio where they were referred
 * @param {string} referredByEmail email provided by user if they say they were referred at signup
 *
 * @returns {Promise<undefined>} creates and/or marks referral as redeemed throws error if fails
 */
module.exports = async function redeemReferralAtSignup({
  referree,
  studio,
  referredByEmail,
}) {
  if (!(studio && studio.id)) return;
  const normalizedEmail = validator.normalizeEmail(referree.email);

  const referral = await models.friend_referrals.findOne({
    where: {
      [Op.or]: [
        {
          email: [referree.email, normalizedEmail],
        },
        { normalizedEmail },
      ],
      createdAt: {
        [Op.gt]: models.friend_referrals.referralCreditValidDate(),
      },
      referredUserId: null,
    },
  });

  if ((!referral) && referredByEmail) { // automatic referral case
    const potentialReferringUser = await models.dibs_user.findOne({
      where: {
        email: [
          referredByEmail.toLowerCase(),
          validator.normalizeEmail(referredByEmail),
        ],
      },
      include: [{
        model: models.dibs_user_studio,
        as: 'userStudios',
        where: { dibs_studio_id: studio.id },
        required: true,
      }],
    });
    await createLib.createFriendReferral({ // create a redeemed referral
      user: potentialReferringUser,
      dibsStudioId: studio.id,
      studio,
      referree,
      rafSource: 'signup',
      sendEmail: false,
      catchError: false,
      automatic: true,
    });
  } else if (referral) {
    await sequelize.transaction(sqlTransaction =>
      Promise.all([
        referral.update( // mark as redeemed by adding a referredUserId
          { referredUserId: referree.id },
          { transaction: sqlTransaction }
        ),
        referree.addCreditForStudio( // add referral credit amount
          referral.amount,
          studio,
          {
            save: true,
            transaction: sqlTransaction,
            creditTransactionType: models.credit_transaction.Types.REFER_A_FRIEND,
          }
        ),
      ]));
  }
};
