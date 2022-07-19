const models = require('@dibs-tech/models');

async function getStudioLocations(req, res) {
    try {
        const { dibsStudioId } = req.body;
        const locations = await models.dibs_studio_locations.findAll({
            attributes: ['id', 'name'],
            where: {
                dibs_studio_id: dibsStudioId,
                visible: true
            }
        });
        if (locations) {
            res.json({
                msg: 'success',
                locations
            });
        } else {
            res.json({
                msg: 'success',
                locations: 'Did not find any locations.'
            });
        }
    } catch (err) {
        console.log(`error in getStudioLocations api call: ${err}`);
        return err;
    }
    return { msg: 'failure - getStudioLocations' };
}

module.exports = getStudioLocations;
