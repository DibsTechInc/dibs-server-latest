const models = require('@dibs-tech/models');

async function updateGeneralLocationData(req, res) {
    // TO DO - WILL NEED TO UPDATE FOR MORE LOCATIONS
    try {
        const { dibsStudioId, email, phone } = req.body;
        await models.dibs_studio_locations.update(
            {
                customer_service_email: email,
                customer_service_phone: phone
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
        console.log(`error in updateGeneralLocationData api call: ${err}`);
        res.json({
            msg: 'failure',
            error: err
        });
    }
    return { msg: 'failure - updateGeneralLocationData' };
}

module.exports = updateGeneralLocationData;
