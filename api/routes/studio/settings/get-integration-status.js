const models = require('@dibs-tech/models');

async function getIntegrationStatusDb(req, res) {
    try {
        const integrations = await models.dibs_studio.findOne({
            attributes: ['liveClassPass', 'liveGympass'],
            where: {
                id: req.body.dibsStudioId
            }
        });
        if (integrations) {
            const classpassStatus = integrations.liveClassPass;
            const statusCpGp = {
                classpass: classpassStatus,
                gympass: false
            };
            res.json({
                msg: 'success',
                integrationstatus: statusCpGp
            });
        } else {
            res.json({
                msg: 'success',
                status: {
                    classpass: false,
                    gympass: false
                }
            });
        }
    } catch (err) {
        console.log(`error in getIntegrationStatusDb api call: ${err}`);
        return err;
    }
    return { msg: 'failure - getIntegrationStatusDb' };
}

module.exports = getIntegrationStatusDb;
