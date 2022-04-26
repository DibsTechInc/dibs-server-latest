const { Op } = require('sequelize');
const StripeClient = require('./client');

const sc = new StripeClient();

/**
 * updateUserCreditCard
 * @param {Object} user user to update credit card
 * @param {Object|string} payload new card for user or card id of new card
 * @param {boolean} useToken if true will use a Stripe generated token to generate the source
 * @returns {Object} sanitizedCard card to return in response to frontend
 */
module.exports = async function updateUserCreditCard(user, payload, dibs_studio_id, { useToken = false } = {}) {
  if (!user.stripeid) {
    const { id: stripeid } = await sc.createCustomer({ email: user.email });
    await user.update({ stripeid });
  }

  let card;
  if (useToken) { // case when a Stripe card ID is sent
    
    const token = payload.tokenId;
    card = await sc.createCardFromToken(user.stripeid, token);
    
    await sc.updateDefaultCard({ stripeUserId: user.stripeid, stripeCardId: card.id });
    
  } else { // case when actual card info is sent
    card = await sc.createCard({
      stripeUserId: user.stripeid,
      cardNumber: payload.ccNum,
      expiration: { month: payload.expMonth, year: payload.expYear },
      cvc: payload.ccCVC || false,
    });
  }

  const previousCardId = user.stripe_cardid;

  user.stripe_cardid = card.id;
  user.card_country = card.country;
  await user.save();

  if (previousCardId) {
    await sc.deleteCard({ stripeUserId: user.stripeid, stripeCardId: previousCardId });
  }

  // For users with subscriptions
  // testing here
  const userStudios = await models.dibs_user_studio.findAll({
    where: { 
        userid: user.id,
        dibs_studio_id,
        stripe_customer_id: {
            [Op.ne]: null,
        }
     },
    include: [{
      model: models.dibs_studio,
      as: 'studio',
    }],
  });
  
  await Promise.each(userStudios, async (userStudio) => {
    if (!userStudio.stripe_customer_id || !userStudio.studio.live) return;
    const token = await sc.createCustomerToken({
      customerId: user.stripeid,
      managedAccount: userStudio.studio.stripe_account_id,
    });
    const userStudioCard = await sc.createCard({
      stripeUserId: userStudio.stripe_customer_id,
      sourceToken: token.id,
      managedAccount: userStudio.studio.stripe_account_id,
    });
   
    await sc.updateDefaultCard({
      stripeUserId: userStudio.stripe_customer_id,
      stripeCardId: userStudioCard.id,
      managedAccount: userStudio.studio.stripe_account_id,
    });
   
  });

  const sanitizedCard = {
    last4: card.last4,
    expMonth: card.exp_month,
    expYear: card.exp_year,
    type: card.brand.toLowerCase(),
  };
  return sanitizedCard;
};
