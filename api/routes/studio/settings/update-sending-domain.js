const models = require('@dibs-tech/models');

async function updateSendingDomain(req, res) {
    // TO DO - WILL NEED TO UPDATE FOR MORE LOCATIONS
    try {
        const { dibsStudioId, customEmail } = req.body;
        console.log(`\n\n\n\n\ncustomEmail = ${customEmail}`);
        console.log(`dibsStudioId = ${dibsStudioId}`);
        await models.dibs_studio.update(
            {
                customSendingDomain: customEmail
            },
            {
                where: {
                    id: dibsStudioId
                }
            }
        );
        res.json({
            msg: 'success'
        });
    } catch (err) {
        console.log(`error in updateSendingDomain api call: ${err}`);
        res.json({
            msg: 'failure',
            error: err
        });
    }
    return { msg: 'failure - updateSendingDomain' };
}

module.exports = updateSendingDomain;
