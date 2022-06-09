if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line global-require
    require('dotenv').config();
}

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27'
});

async function getStudioStripePaymentMethods(req, res) {
    try {
        const { stripeid } = req.body;
        let paymentMethodsStudio;
        if (stripeid.length > 1) {
            paymentMethodsStudio = await stripe.customers.listPaymentMethods(stripeid, {
                type: 'card'
            });
            console.log(`number of payment methods for this studio on dibs is: ${paymentMethodsStudio.data.length}`);
        }
        if (paymentMethodsStudio.data.length > 0) {
            res.json({
                msg: 'success',
                paymentInfo: paymentMethodsStudio.data[0],
                paymentOnFile: true
            });
        }
        res.json({
            msg: 'success',
            paymentInfo: [],
            paymentOnFile: false
        });
    } catch (err) {
        console.log(`error in getStudioStripePaymentMethods api call: ${err}`);
        return err;
    }
    return {
        msg: 'failure - getStudioStripePaymentMethods'
    };
}

module.exports = getStudioStripePaymentMethods;
