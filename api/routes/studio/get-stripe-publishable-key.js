if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line global-require
    require('dotenv').config();
}

const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY;

async function getStripePublishableKey(req, res) {
    try {
        res.json({
            msg: 'success',
            stripePublishableKey
        });
    } catch (err) {
        console.log(`error in getStripePublishableKey api call: ${err}`);
        return err;
    }
    return {
        msg: 'failure - getStripePublishableKey'
    };
}

module.exports = getStripePublishableKey;
