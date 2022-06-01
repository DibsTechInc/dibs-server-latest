const models = require('@dibs-tech/models');

async function updateGlobalPriceSettings(req, res) {
    try {
        const { dibsStudioId, minPrice, maxPrice } = req.body;
        await models.studio_pricing.update(
            {
                min_price: minPrice,
                max_price: maxPrice
            },
            {
                where: {
                    dibs_studio_id: dibsStudioId
                }
            }
        );
        res.json({
            msg: 'success'
        });
    } catch (err) {
        console.log(`error in updateGlobalPriceSettings api call: ${err}`);
        res.json({
            msg: 'failure',
            error: err
        });
    }
    return { msg: 'failure - updateGlobalPriceSettings' };
}

module.exports = updateGlobalPriceSettings;
