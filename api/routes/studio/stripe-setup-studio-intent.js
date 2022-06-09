if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line global-require
    require('dotenv').config();
}

const models = require('@dibs-tech/models');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27'
});

async function setupStripeStudioIntent(req, res) {
    try {
        const { dibsStudioId, stripeid, billingContact, billingEmail } = req.body;
        let stripeidtouse;
        if (stripeid) {
            stripeidtouse = stripeid;
            console.log(`\n\nthere is a stripe id`);
        } else {
            console.log(`\n\nthere is NOT a stripe id`);
            const stripecustomer = await stripe.customers.create({
                email: billingEmail,
                name: billingContact
            });
            stripeidtouse = stripecustomer.id;
        }
        const customerid = stripeidtouse;
        const setupIntent = await stripe.setupIntents.create({
            payment_method_types: ['card'],
            customer: customerid,
            usage: 'off_session'
        });
        if (setupIntent.id) {
            models.dibs_studio.update(
                {
                    stripeid: customerid
                },
                {
                    where: {
                        id: dibsStudioId
                    }
                }
            );
        }
        res.json({
            msg: 'success',
            stripeIntent: setupIntent.client_secret,
            stripeId: setupIntent.customer
        });
    } catch (err) {
        console.log(`error in createStudioStripeSetupIntent api call: ${err}`);
        return err;
    }
    return { msg: 'failure - createStudioStripeSetupIntent' };
}

module.exports = setupStripeStudioIntent;
