const models = require('@dibs-tech/models');
const errorHelper = require('../../../../lib/errors');
const { Op } = require('sequelize');

async function getActivePromoCodes(req, res) {
    const { dibsStudioId } = req.body;
    try {
        const promocodes = await models.promo_code.findAll({
            attributes: [
                'id',
                'amount',
                'code',
                'type',
                'expiration',
                'createdAt',
                ['code_usage_limit', 'totalUsageLimit'],
                ['user_usage_limit', 'perPersonLimit'],
                ['first_time_studio_dibs', 'firstTimeStudio'],
                'employeeid',
                'product'
            ],
            where: {
                dibs_studio_id: dibsStudioId,
                expiration: {
                    [Op.gt]: new Date()
                }
            },
            order: [
                ['code', 'ASC'],
                ['expiration', 'ASC'],
                ['createdAt', 'ASC']
            ],
            paranoid: true
        });
        if (promocodes) {
            res.json({
                msg: 'success',
                countcodes: promocodes.length,
                promocodes
            });
        } else {
            res.json({
                msg: 'success',
                countcodes: 0,
                promocodes: []
            });
        }
    } catch (err) {
        res.json({
            msg: 'failure',
            error: err
        });
        errorHelper.handleError({
            opsSubject: 'getActivePromoCodes Error',
            employeeid: dibsStudioId,
            res
        })(err);
    }
}

module.exports = getActivePromoCodes;
