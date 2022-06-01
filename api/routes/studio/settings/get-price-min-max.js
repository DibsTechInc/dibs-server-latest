const models = require('@dibs-tech/models');

async function getPricingMinMax(req, res) {
    try {
        const { dibsStudioId } = req.body;
        const prices = await models.studio_pricing.findOne({
            attributes: ['min_price', 'max_price'],
            where: {
                dibs_studio_id: dibsStudioId
            }
        });
        if (prices) {
            // eslint-disable-next-line camelcase
            const { min_price, max_price } = prices;
            const pricedata = {
                min: min_price,
                max: max_price
            };
            res.json({
                msg: 'success',
                pdata: pricedata
            });
        } else {
            res.json({
                msg: 'success',
                integrationstatus: {
                    classpass: false,
                    gympass: false
                }
            });
        }
    } catch (err) {
        console.log(`error in getPricingMinMax api call: ${err}`);
        return err;
    }
    return { msg: 'failure - getPricingMinMax' };
}

module.exports = getPricingMinMax;
