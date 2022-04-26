if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line global-require
    require('dotenv').config();
}

const models = require('@dibs-tech/models');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27'
});

async function setupStripeIntent(req, res) {
    try {
        const customerinfo = await models.dibs_user.findOne({
            where: {
                id: req.body.userid
            }
        });
        let stripeid;
        if (customerinfo) {
            if (customerinfo.stripeid) stripeid = customerinfo.stripeid;
            else {
                console.log(`\n\n`);
                console.log('creating a new customer in stripe');
                const stripecustomer = await stripe.customers.create({
                    email: customerinfo.email,
                    name: `${customerinfo.firstName} ${customerinfo.lastName}`
                });
                stripeid = stripecustomer.id;
            }
        }
        console.log(`req.body = ${JSON.stringify(req.body)}`);
        const customerid = stripeid;
        const setupIntent = await stripe.setupIntents.create({
            payment_method_types: ['card'],
            customer: customerid,
            usage: 'off_session'
        });
        if (setupIntent.id) {
            models.dibs_user.update(
                {
                    stripeid: customerid
                },
                {
                    where: {
                        id: req.body.userid
                    }
                }
            );
        }
        console.log(`\n\n\n\nfrom stripe ---> ${JSON.stringify(setupIntent)}`);
        console.log(`stripeid is: ${setupIntent.customer}`);
        res.json({
            msg: 'success',
            stripeIntent: setupIntent.client_secret,
            stripeId: setupIntent.customer
        });
    } catch (err) {
        console.log(`error in createStripeSetupIntent api call: ${err}`);
        return err;
    }
    return { msg: 'failure - createStripeSetupIntent' };
}

module.exports = setupStripeIntent;
