const models = require('@dibs-tech/models');

async function updateCancelTime(req, res) {
    try {
        const { dibsStudioId, cancelTime } = req.body;
        console.log(`cancelTime is: ${cancelTime}`);
        await models.dibs_studio.update(
            {
                cancel_time: cancelTime
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
        console.log(`error in updateCancelTime api call: ${err}`);
        res.json({
            msg: 'failure',
            error: err
        });
    }
    return { msg: 'failure - updateCancelTime' };
}

module.exports = updateCancelTime;
