const models = require('@dibs-tech/models');

async function getGeneralLocationData(req, res) {
    try {
        const locationdata = await models.dibs_studio_locations.findAll({
            attributes: [
                'customer_service_phone',
                'customer_service_email',
                'retail_tax_rate',
                'tax_rate',
                'short_name',
                'address',
                'address2',
                'city',
                'state',
                'zipcode',
                'latitude',
                'longitude'
            ],
            where: {
                dibs_studio_id: req.body.dibsStudioId
            }
        });
        res.json({
            msg: 'success',
            locationdata
        });
    } catch (err) {
        console.log(`error in getGeneralLocationData api call: ${err}`);
        res.json({
            msg: 'failure',
            error: err
        });
    }
    return { msg: 'failure - getGeneralLocationData' };
}

module.exports = getGeneralLocationData;
