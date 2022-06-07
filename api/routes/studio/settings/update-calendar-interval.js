const models = require('@dibs-tech/models');

async function updateIntervalEnd(req, res) {
    try {
        const { dibsStudioId, intervalEnd } = req.body;
        console.log(`intervalEnd is: ${intervalEnd}`);
        await models.dibs_config.update(
            {
                interval_end: intervalEnd
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
        console.log(`error in updateIntervalEnd api call: ${err}`);
        res.json({
            msg: 'failure',
            error: err
        });
    }
    return { msg: 'failure - updateIntervalEnd' };
}

module.exports = updateIntervalEnd;
