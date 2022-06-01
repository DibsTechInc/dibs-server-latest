const models = require('@dibs-tech/models');

async function updateDynamicPricingStatus(req, res) {
    try {
        const { dibsStudioId, status } = req.body;
        await models.dibs_studio_locations.update(
            {
                dynamic_pricing: status
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
        console.log(`error in updateDynamicPricingStatus api call: ${err}`);
        res.json({
            msg: 'failure',
            error: err
        });
    }
    return { msg: 'failure - updateDynamicPricingStatus' };
}

module.exports = updateDynamicPricingStatus;
