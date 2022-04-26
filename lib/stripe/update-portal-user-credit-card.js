const StripeClient = require('./client');

const sc = new StripeClient();

/**
 * updatePortalUserCreditCard
 * @param {Object} user user to update credit card
 * @param {Object|string} payload new card for user or card id of new card
 * @param {boolean} useToken if true will use a Stripe generated token to generate the source
 * @returns {Object} sanitizedCard card to return in response to frontend
 */
module.exports = async function updatePortalUserCreditCard(user, payload, { useToken = false } = {}) {
  if (!user.stripe_customer_id) {
    const { id: stripe_customer_id } = await sc.createCustomer({ email: user.email });
    await user.update({ stripe_customer_id });
  }

  let card;
  if (useToken) { // case when a Stripe card ID is sent
    card = await sc.createCardFromToken(user.stripe_customer_id, payload);
    await sc.updateDefaultCard({ stripeUserId: user.stripe_customer_id, stripeCardId: card.id });
  } else { // case when actual card info is sent
    card = await sc.createCard({
      stripeUserId: user.stripe_customer_id,
      cardNumber: payload.ccNum,
      expiration: { month: payload.expMonth, year: payload.expYear },
      cvc: payload.ccCVC || false,
    });
  }

  const previousCardId = user.stripe_card_id;

  user.stripe_card_id = card.id;
  await user.save();

  if (previousCardId) {
    await sc.deleteCard({ stripeUserId: user.stripe_customer_id, stripeCardId: previousCardId });
  }

  // For the studio specific credit cards
  const userStudios = await models.dibs_user_studio.findAll({
    where: { dibs_portal_userid: user.id },
    include: [{
      model: models.dibs_studio,
      as: 'studio',
    }],
  });
  await Promise.each(userStudios, async (userStudio) => {
    if (!userStudio.stripe_customer_id) return;
    const token = await sc.createCustomerToken({
      customerId: user.stripe_customer_id,
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
