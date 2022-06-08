const models = require('@dibs-tech/models');

async function updateStudioColor(req, res) {
    try {
        const { dibsStudioId, studioColor } = req.body;
        await models.dibs_config.update(
            {
                color: studioColor
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
        console.log(`error in updateStudioColor api call: ${err}`);
        res.json({
            msg: 'failure',
            error: err
        });
    }
    return { msg: 'failure - updateStudioColor' };
}

module.exports = updateStudioColor;
