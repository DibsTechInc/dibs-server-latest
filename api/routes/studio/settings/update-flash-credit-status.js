const models = require('@dibs-tech/models');

async function updateFlashCreditStatus(req, res) {
    try {
        const { dibsStudioId, status } = req.body;
        await models.dibs_config.update(
            {
                send_flash_credits: status
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
        console.log(`error in updateFlashCreditStatus api call: ${err}`);
        res.json({
            msg: 'failure',
            error: err
        });
    }
    return { msg: 'failure - updateFlashCreditStatus' };
}

module.exports = updateFlashCreditStatus;
