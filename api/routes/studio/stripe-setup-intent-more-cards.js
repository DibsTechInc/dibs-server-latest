if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line global-require
    require('dotenv').config();
}

const models = require('@dibs-tech/models');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27'
});

async function setupStripeIntentMoreCards(req, res) {
    console.log(`\n\n\n\n\nMORE CARDS ARE BEING ADDED`);
    try {
        const { stripeid } = req.body;
        console.log(`req.body = ${JSON.stringify(req.body)}`);
        const setupIntent = await stripe.setupIntents.create({
            payment_method_types: ['card'],
            customer: stripeid,
            usage: 'off_session'
        });
        console.log(`\n\n\n\nfrom more cards - stripe ---> ${JSON.stringify(setupIntent)}`);
        // console.log(`stripeid is: ${setupIntent.customer}`);
        res.json({
            msg: 'success',
            stripeIntent: setupIntent.client_secret,
            stripeId: setupIntent.customer
        });
    } catch (err) {
        console.log(`error in createStripeSetupIntent More Cards api call: ${err}`);
        return err;
    }
    return { msg: 'failure - createStripeSetupIntent More Cards' };
}

module.exports = setupStripeIntentMoreCards;
