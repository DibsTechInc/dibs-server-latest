const models = require('@dibs-tech/models');

async function getClientCredit(req, res) {
    try {
        const { userid, dibsStudioId } = req.body;
        const credit = await models.credit.findOne({
            attributes: ['id', 'credit'],
            where: {
                userid,
                dibs_studio_id: dibsStudioId
            }
        });
        if (credit) {
            let credittosend = credit.credit;
            if (credittosend === 'NaN') {
                credittosend = 0;
            }
            res.json({
                msg: 'success',
                credit: credittosend
            });
        } else {
            res.json({
                msg: 'success',
                credit: 0
            });
        }
    } catch (err) {
        console.log(`error in getClientCredit api call: ${err}`);
        return err;
    }
    return { msg: 'failure - getClientCredit' };
}

module.exports = getClientCredit;
