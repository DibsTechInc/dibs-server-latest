const models = require('@dibs-tech/models');

async function getDynamicPricingStatus(req, res) {
    try {
        const studioDynamicPricingData = [];
        const datatoreturn = {
            hasDynamicPricing: false
        };
        const dynamicpricing = await models.dibs_studio_locations.findAll({
            attributes: ['id', 'dynamic_pricing'],
            where: {
                dibs_studio_id: req.body.dibsStudioId
            }
        });
        console.log(`dynamic_pricing: ${JSON.stringify(dynamicpricing)}`);
        if (dynamicpricing) {
            if (dynamicpricing.length > 1) {
                datatoreturn.hasMultipleLocations = true;
            } else {
                datatoreturn.hasMultipleLocations = false;
            }
            dynamicpricing.forEach((location, i) => {
                if (location.dynamic_pricing) {
                    datatoreturn.hasDynamicPricing = true;
                    studioDynamicPricingData.push({
                        [i]: {
                            locationid: location.id,
                            dynamicPricing: true
                        }
                    });
                } else {
                    studioDynamicPricingData.push({
                        [i]: {
                            locationid: location.id,
                            dynamicPricing: false
                        }
                    });
                }
            });
            datatoreturn.pricingdata = studioDynamicPricingData;
            res.json({
                msg: 'success',
                pricingData: datatoreturn
            });
        } else {
            res.json({
                msg: 'success',
                pricingData: datatoreturn
            });
        }
    } catch (err) {
        console.log(`error in getDynamicPricingStatusDB api call: ${err}`);
        res.json({
            msg: 'failure',
            error: err
        });
    }
    return { msg: 'failure - getDynamicPricingStatusDB' };
}

module.exports = getDynamicPricingStatus;
