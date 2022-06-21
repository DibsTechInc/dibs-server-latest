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
            res.json({
                msg: 'success',
                payouts: infotosendback
            });
            // res.json(apiSuccessWrapper({ payouts: infotosendback }, 'Successfully retrieved payout data'));
        });
    } catch (err) {
        console.log(err instanceof Error ? err.stack : err);
        return errorHelper.handleError({
            opsSubject: 'Get Payouts Error',
            employeeid: id,
            res
        });
    }
    return { msg: 'failure - getPayouts' };
};
