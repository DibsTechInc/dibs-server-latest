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
        const { stripeid, studioStripeId, userid, dibsStudioId } = req.body;
        let paymentMethodsStudio;
        let paymentMethodsDibs;
        let newPm;
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
            paymentMethodsDibs = await stripe.customers.listPaymentMethods(stripeid, {
                type: 'card'
            });
            console.log(`number of payment methods on Dibs = ${paymentMethodsDibs.data.length}`);
        }
        // no stripe customer on studio side
        // there ARE payment methods in dibs
        if (paymentMethodsDibs.data.length > 0) {
            if (!studioStripeId && stripeid) {
                console.log('stripe id exists but studio stripe id does not');
                const dibsUser = await models.dibs_user.findOne({
                    where: {
                        id: userid,
                        stripeid
                    }
                });
                // get the studio account id
                const studioStripeAccount = await models.dibs_studio.findOne({
                    where: {
                        id: dibsStudioId
                    }
                });
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
                    // create a payment method based on dibs payment method
                    newPm = await stripe.paymentMethods.create(
                        {
                            customer: stripeid,
                            payment_method: paymentMethodsDibs.data[0].id
                        },
                        {
                            stripeAccount: studioStripeAccount.stripe_account_id
                        }
                    );
                    // attach the payment method
                    await stripe.paymentMethods.attach(
                        newPm.id,
                        { customer: stripeStudioCustomer.id },
                        {
                            stripeAccount: studioStripeAccount.stripe_account_id
                        }
                    );
                    await stripe.setupIntents.create(
                        {
                            payment_method_types: ['card'],
                            customer: stripeStudioCustomer.id,
                            payment_method: newPm.id,
                            usage: 'off_session'
                        },
                        {
                            stripeAccount: studioStripeAccount.stripe_account_id
                        }
                    );
                    // save studioid in dibs_user_studios table
                    const [userStudio, created] = await models.dibs_user_studio.findOrCreate({
                        where: { userid, dibs_studio_id: dibsStudioId },
                        defaults: {
                            source: 'zf',
                            has_attended: false,
                            stripe_customer_id: stripeStudioCustomer.id,
                            showed_vax_proof: false
                        }
                    });
                    console.log(`id = ${userStudio.id}, created = ${created}`);
                    await models.dibs_user_studio.update(
                        {
                            stripe_customer_id: stripeStudioCustomer.id
                        },
                        {
                            where: {
                                id: userStudio.id
                            }
                        }
                    );
                    paymentMethodsStudio = await stripe.customers.listPaymentMethods(
                        stripeStudioCustomer.id,
                        {
                            type: 'card'
                        },
                        {
                            stripeAccount: 'acct_1DjA4EKWpRIYpaNk'
                        }
                    );
                }
            }
        } else {
            res.json({
                msg: 'no payment methods on dibs'
            });
        }
        if (paymentMethodsDibs || paymentMethodsStudio) {
            // console.log(`\n\n\n\npaymentMethodsDibs -> ${JSON.stringify(paymentMethodsDibs)}`);
            // console.log(`\n\n\n\npaymentMethodsStudio -> ${JSON.stringify(paymentMethodsStudio)}`);
            res.json({
                msg: 'success',
                paymentMethodsStudio: paymentMethodsStudio || newPm,
                paymentMethodsDibs
            });
        } else {
            res.json({
                msg: 'no payment methods found'
            });
        }
    } catch (err) {
        console.log(`error in getStripePaymentMethods api call: ${err}`);
        return err;
    }
    return {
        msg: 'failure - getStripePaymentMethods'
    };
}

module.exports = getStripePaymentMethods;
