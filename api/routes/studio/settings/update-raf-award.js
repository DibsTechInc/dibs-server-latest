const models = require('@dibs-tech/models');

async function updateRafAward(req, res) {
    try {
        const { dibsStudioId, raf } = req.body;
        console.log(`raf is: ${raf}`);
        await models.dibs_config.update(
            {
                raf_award: raf
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
        console.log(`error in updateRafAward api call: ${err}`);
        res.json({
            msg: 'failure',
            error: err
        });
    }
    return { msg: 'failure - updateRafAward' };
}

module.exports = updateRafAward;
