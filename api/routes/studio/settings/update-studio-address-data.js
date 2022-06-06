const models = require('@dibs-tech/models');

async function updateStudioAddress(req, res) {
    // TO DO - WILL NEED TO UPDATE FOR MORE LOCATIONS
    try {
        const { dibsStudioId, addressObject } = req.body;
        const { addressValue, address2Value, cityValue, stateValue, zipValue } = addressObject;
        await models.dibs_studio_locations.update(
            {
                address: addressValue,
                address2: address2Value,
                city: cityValue,
                state: stateValue,
                zipcode: zipValue
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
        console.log(`error in updateStudioAddress api call: ${err}`);
        res.json({
            msg: 'failure',
            error: err
        });
    }
    return { msg: 'failure - updateStudioAddress' };
}

module.exports = updateStudioAddress;
