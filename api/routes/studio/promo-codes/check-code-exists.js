const errorHelper = require('../../../../lib/errors');
const { Op } = require('sequelize');

module.exports = async function checkPromoCodeExists(req, res) {
    const { dibsStudioId, code } = req.body;
    try {
        const promocode = await models.promo_code.findOne({
            where: {
                dibs_studio_id: dibsStudioId,
                code,
                expiration: {
                    [Op.gt]: new Date()
                }
            },
            paranoid: true
        });
        if (promocode) {
            res.json({
                msg: 'success',
                codeExists: true
            });
        } else {
            res.json({
                msg: 'success',
                codeExists: false
            });
        }
    } catch (err) {
        errorHelper.handleError({
            opsSubject: 'checkPromoCodeExists Error',
            employeeid: dibsStudioId,
            res
        })(err);
    }
};
