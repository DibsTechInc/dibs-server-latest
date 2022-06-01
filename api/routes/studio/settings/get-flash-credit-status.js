const models = require('@dibs-tech/models');

async function getFlashCreditStatus(req, res) {
    try {
        const { dibsStudioId } = req.body;
        const fc = await models.dibs_config.findOne({
            where: {
                dibs_studio_id: dibsStudioId
            }
        });
        res.json({
            msg: 'success',
            status: fc.send_flash_credits
        });
    } catch (err) {
        console.log(`error in getFlashCreditStatus api call: ${err}`);
        res.json({
            msg: 'failure',
            error: err
        });
    }
    return { msg: 'failure - getFlashCreditStatus' };
}

module.exports = getFlashCreditStatus;
