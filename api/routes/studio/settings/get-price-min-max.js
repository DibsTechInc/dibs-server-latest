const models = require('@dibs-tech/models');

async function getPricingMinMax(req, res) {
    try {
        const { dibsStudioId } = req.body;
        console.log(`pulling price data for ${dibsStudioId}`);
        const prices = await models.studio_pricing.findOne({
            attributes: ['min_price', 'max_price'],
            where: {
                dibs_studio_id: dibsStudioId
            }
        });
        console.log(`\n\n\n\nprices data from db: ${JSON.stringify(prices)}`);
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
                msg: 'failure',
                pdata: {
                    min: 10,
                    max: 50
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
