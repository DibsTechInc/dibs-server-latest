const StripeClient = require('../../../../lib/stripe/client');
const moment = require('moment-timezone');
const models = require('../../../../models/sequelize');
const Promise = require('bluebird');

const sc = new StripeClient();
const StripePayouts = models.stripe_payouts;
const DibsTransactions = models.dibs_transaction;
const DibsStudio = models.dibs_studio;

/**
 * processPayoutTransactions
 * @param {Object} _payout in payout webhook from Stripe
 * @param {string} stripeAccountId of the studio
 * @returns {Promise<undefined>} upserts the payout
 */
async function processPayoutTransactions(_payout, stripeAccountId) {
    const payout = { ..._payout };
    const studio = await DibsStudio.findOne({ where: { stripe_account_id: stripeAccountId } });
    if (!studio) return Promise.resolve();
    payout.dibs_studio_id = studio.id;
    payout.stripe_account_id = stripeAccountId;
    payout.arrival_date = moment.unix(payout.arrival_date);
    const [stripePayout] = await StripePayouts.findOrInitialize({ where: { id: payout.id } });
    const keys = Object.keys(payout);
    // eslint-disable-next-line no-return-assign
    keys.forEach((key) => (stripePayout[key] = payout[key]));
    await stripePayout.save().bind(stripePayout);

    // get all payout transactions from stripe
    const payoutPaymentTransactions = await sc.getPaymentTransactionsForPayout(stripeAccountId, payout.id);
    const payoutPaymentRefundTransactions = await sc.getPaymentRefundTransactionsForPayout(stripeAccountId, payout.id);
    const payoutChargeTransactions = await sc.getChargeTransactionsForPayout(stripeAccountId, payout.id);
    const payoutRefundTransactions = await sc.getRefundTransactionsForPayout(stripeAccountId, payout.id);

    // update our db with payout transaction info
    await Promise.each(payoutPaymentTransactions, (trans) => {
        const paymentId = trans.source.id;
        const chargeId = trans.source.source_transfer.source_transaction.id;
        return DibsTransactions.update(
            {
                stripePayoutId: payout.id,
                stripePaymentId: paymentId
            },
            {
                where: {
                    stripe_charge_id: chargeId
                },
                paranoid: false
            }
        );
    });
    await Promise.each(payoutPaymentRefundTransactions, (trans) => {
        const paymentId = trans.source.charge;
        return DibsTransactions.update(
            {
                stripeRefundPayoutId: payout.id
            },
            {
                where: {
                    stripePaymentId: paymentId
                },
                paranoid: false
            }
        );
    });
    await Promise.each(payoutChargeTransactions, (trans) => {
        const chargeId = trans.source.id;
        return DibsTransactions.update(
            {
                stripePayoutId: payout.id
            },
            {
                where: {
                    stripe_charge_id: chargeId
                },
                paranoid: false
            }
        );
    });
    return Promise.each(payoutRefundTransactions, (trans) => {
        const chargeId = trans.source.charge;
        return DibsTransactions.update(
            {
                stripeRefundPayoutId: payout.id
            },
            {
                where: {
                    stripe_charge_id: chargeId
                },
                paranoid: false
            }
        );
    });
}

module.exports = processPayoutTransactions;
