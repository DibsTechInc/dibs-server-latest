const moment = require('moment-timezone');
const { Op } = require('sequelize');
const errorHelper = require('../../../../lib/helpers/error-helper');
const sc = require('../../../../lib-new/stripe/client');

module.exports = async function getPayouts(req, res) {
    const { id, dibsStudioId } = req.body;
    const infotosendback = [];
    try {
        const stripeAccountId = await models.dibs_studio.findOne({
            attributes: ['stripe_account_id'],
            where: {
                id: dibsStudioId
            }
        });
        const studioPayouts = await models.stripe_payouts.findAll({
            where: {
                dibs_studio_id: dibsStudioId,
                arrival_date: {
                    [Op.gte]: moment().subtract(360, 'days').format('YYYY-MM-DD')
                },
                livemode: true
            },
            order: [['created', 'DESC']]
        });
        const formatPayouts = async (pay, index) => {
            const newpayout = await sc.formatPayoutWithBankDetails(stripeAccountId.stripe_account_id, pay);
            infotosendback[index] = newpayout;
            return newpayout;
        };
        Promise.all(
            studioPayouts.map(async (payout, index) => {
                await formatPayouts(payout, index);
            })
        ).then(() => {
            if (infotosendback[0].type === 'StripeInvalidRequestError') {
                res.json({
                    msg: 'failure',
                    error: `We're having some trouble getting payouts data from Stripe. Our team has been notified. If you believe that you're seeing this message in error, please make sure that you're connected to the internet. If the problem continues, please contact us at studios@ondibs.com.`
                });
            }
            res.json({
                msg: 'success',
                payouts: infotosendback
            });
            // res.json(apiSuccessWrapper({ payouts: infotosendback }, 'Successfully retrieved payout data'));
        });
    } catch (err) {
        console.log(err instanceof Error ? err.stack : err);
        res.json({
            msg: 'failure'
        });
        return errorHelper.handleError({
            opsSubject: 'Get Payouts Error',
            employeeid: id,
            res
        });
    }
    return { msg: 'failure - getPayouts' };
};
