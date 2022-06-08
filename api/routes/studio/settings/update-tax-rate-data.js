const models = require('@dibs-tech/models');

async function updateTaxRates(req, res) {
    // TO DO - WILL NEED TO UPDATE FOR MORE LOCATIONS
    try {
        const { dibsStudioId, retailTax, salesTax } = req.body;
        await models.dibs_studio_locations.update(
            {
                retail_tax_rate: retailTax,
                tax_rate: salesTax
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
        console.log(`error in updateTaxRates api call: ${err}`);
        res.json({
            msg: 'failure',
            error: err
        });
    }
    return { msg: 'failure - updateTaxRates' };
}

module.exports = updateTaxRates;
