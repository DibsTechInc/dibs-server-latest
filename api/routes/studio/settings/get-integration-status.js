const models = require('@dibs-tech/models');

async function getIntegrationStatusDb(req, res) {
    try {
        console.log(`dibsid is: ${req.body.dibsStudioId}`);
        // add gympass here once integration is live
        const integrations = await models.dibs_studio.findOne({
            attributes: ['liveClassPass', 'liveGympass'],
            where: {
                id: req.body.dibsStudioId
            }
        });
        console.log('line 13');
        console.log(`integrations is: ${JSON.stringify(integrations)}`);
        if (integrations) {
            console.log(`typeof integrations is: ${typeof integrations}`);
            console.log(`typeof integrations.liveClassPass is: ${typeof integrations.liveClassPass}`);
            const classpassStatus = integrations.liveClassPass;
            console.log(`classpassStatus is: ${classpassStatus}`);
            const statusCpGp = {
                classpass: classpassStatus,
                gympass: false
            };
            console.log('line 23');
            console.log('returning integrations true');
            res.json({
                msg: 'success',
                integrationstatus: statusCpGp
            });
        } else {
            console.log('returning integrations false');
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
