const models = require('@dibs-tech/models');

async function getIntegrationStatusDb(req, res) {
    try {
        const integrations = await models.dibs_studio.findOne({
            attributes: ['liveClassPass', 'live_gympass', 'customSendingDomain'],
            where: {
                id: req.body.dibsStudioId
            }
        });
        if (integrations) {
            // eslint-disable-next-line camelcase
            const { liveClassPass, live_gympass } = integrations;
            const statusCpGp = {
                classpass: liveClassPass,
                gympass: live_gympass,
                customEmailSentFrom: integrations.customSendingDomain
            };
            res.json({
                msg: 'success',
                integrationstatus: statusCpGp
            });
        } else {
            res.json({
                msg: 'success',
                integrationstatus: {
                    classpass: false,
                    gympass: false,
                    customEmailSentFrom: null
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
