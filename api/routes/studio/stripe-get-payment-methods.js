if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line global-require
    require('dotenv').config();
}

const models = require('@dibs-tech/models');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27'
});

async function getStripePaymentMethods(req, res) {
    try {
        console.log(`\n\n\nreq.body = ${JSON.stringify(req.body)}`);
        const { stripeid, studioStripeId, userid, dibsStudioId } = req.body;
        console.log(`\n\n\nstripeid = ${stripeid}`);
        console.log(`\n\n\nstudioStripeId = ${studioStripeId}`);
        let paymentMethodsStudio;
        let paymentMethodDibs;
        if (studioStripeId.length > 1) {
            paymentMethodsStudio = await stripe.customers.listPaymentMethods(
                studioStripeId,
                {
                    type: 'card'
                },
                {
                    stripeAccount: 'acct_1DjA4EKWpRIYpaNk'
                }
            );
            console.log(`number of payment methods on Studio = ${paymentMethodsStudio.data.length}`);
        }
        if (stripeid.length > 1) {
            paymentMethodDibs = await stripe.customers.listPaymentMethods(stripeid, {
                type: 'card'
            });
            console.log(`\n\n\npaymentMethodsDibs -> ${JSON.stringify(paymentMethodDibs)}`);
            console.log(`number of payment methods on Dibs = ${paymentMethodDibs.data.length}`);
        }
        // no stripe customer on studio side
        console.log(`\n\nstudioStripeId = rightbefore${studioStripeId}rightafter`);
        if (!studioStripeId && stripeid) {
            console.log('stripe id exists but studio stripe id does not');
            const dibsUser = await models.dibs_user.findOne({
                where: {
                    id: userid,
                    stripeid
                }
            });
            console.log(`\n\n\n\n\n\ndibsUser is: ${JSON.stringify(dibsUser)}`);
            // get the studio account id
            const studioStripeAccount = await models.dibs_studio.findOne({
                where: {
                    id: dibsStudioId
                }
            });
            console.log(`studioStripeAccount is: ${JSON.stringify(studioStripeAccount)}`);
            if (dibsUser) {
                // create stripe customer on studio
                const stripeStudioCustomer = await stripe.customers.create(
                    {
                        email: dibsUser.email,
                        name: `${dibsUser.firstName} ${dibsUser.lastName}`
                    },
                    {
                        stripeAccount: studioStripeAccount.stripe_account_id
                    }
                );
                console.log(`stripeCustomer created is: ${JSON.stringify(stripeStudioCustomer.id)}`);
                // create a payment method based on dibs payment method
                const newPm = await stripe.paymentMethods.create(
                    {
                        customer: stripeid,
                        payment_method: paymentMethodDibs.data[0].id
                    },
                    {
                        stripeAccount: studioStripeAccount.stripe_account_id
                    }
                );
                console.log(`\n\n\n\n\n\n\nnewPm is: ${JSON.stringify(newPm)}`);
                // attach the payment method
                console.log(`\n\n\n\n\nstripStudioCustomer.id = ${stripeStudioCustomer.id}`);
                console.log(`paymentmethod new one: ${newPm.id}`);
                const pmAttached = await stripe.paymentMethods.attach(
                    newPm.id,
                    { customer: stripeStudioCustomer.id },
                    {
                        stripeAccount: studioStripeAccount.stripe_account_id
                    }
                );
                // const pmAttached = await stripe.paymentMethods.attach(
                //     {
                //         customer: stripeStudioCustomer.id,
                //         payment_method: newPm.id
                //     },
                //     {
                //         stripeAccount: studioStripeAccount.stripe_account_id
                //     }
                // );
                console.log(`\n\n\n\npmAttached is: ${JSON.stringify(pmAttached)}`);
                const setupIntent = await stripe.setupIntents.create({
                    payment_method_types: ['card'],
                    customer: stripeStudioCustomer.id,
                    payment_method: newPm.id,
                    usage: 'off_session',
                    on_behalf_of: studioStripeAccount.stripe_account_id
                });
                console.log(`setupIntent - ${JSON.stringify(setupIntent)}`);
            }
        }
        console.log(`\n\n\n\npaymentMethodsDibs -> ${JSON.stringify(paymentMethodDibs)}`);
        console.log(`\n\n\n\npaymentMethodsStudio -> ${JSON.stringify(paymentMethodsStudio)}`);
        res.json({
            msg: 'success'
            // paymentMethodsStudio: paymentMethodsStudio.data,
            // paymentMethodsDibs: paymentMethodsDibs.data
        });
    } catch (err) {
        console.log(`error in getStripePaymentMethods api call: ${err}`);
        return err;
    }
    return {
        msg: 'failure - getStripePaymentMethods'
    };
}

module.exports = getStripePaymentMethods;
