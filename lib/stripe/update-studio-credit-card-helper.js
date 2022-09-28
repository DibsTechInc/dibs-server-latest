const StripeClient = require('./studio-client');

const sc = new StripeClient();

/**
 * updateStudioCreditCard
 * @param {Object} studio to update credit card
 * @param {Object|string} payload new card for studio or card id of new card
 * @param {boolean} useToken if true will use a Stripe generated token to generate the source
 * @returns {Object} sanitizedCard card to return in response to frontend
 */
module.exports = async function updateStudioCreditCard(studio, payload, { useToken = false } = {}) {
    if (!studio.stripeid) {
        const { id: stripeid } = await sc.createCustomer({
            email: payload.email,
            name: payload.name
        });

        await studio.update({ stripeid });
    }

    let card;
    if (useToken) {
        // case when a Stripe card ID is sent
        card = await sc.createCardFromToken(studio.stripeid, payload.token);

        await sc.updateDefaultCard({ stripeUserId: studio.stripeid, stripeCardId: card.id });
    } else {
        // case when actual card info is sent
        card = await sc.createCard({
            stripeUserId: studio.stripeid,
            cardNumber: payload.ccNum,
            expiration: { month: payload.expMonth, year: payload.expYear },
            cvc: payload.ccCVC || false
        });
    }

    const previousCardId = studio.stripe_cardid;

    studio.stripe_cardid = card.id;
    studio.card_country = card.country;
    await studio.save();

    if (previousCardId) {
        await sc.deleteCard({ stripeUserId: studio.stripeid, stripeCardId: previousCardId });
    }

    const dibsstripeaccountid = await models.dibs_studio.findOne({
        where: {
            id: 0
        }
    });

    const sanitizedCard = {
        last4: card.last4,
        expMonth: card.exp_month,
        expYear: card.exp_year,
        type: card.brand.toLowerCase()
    };
    return sanitizedCard;
};
