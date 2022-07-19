const errorHelper = require('../../../../lib/errors');

const {
    Sequelize: { Op }
} = models;

module.exports = async function getSalesData(req, res) {
    const { dibsStudioId, salesInfo } = req.body;
    const { startDate, endDate } = salesInfo;
    try {
        const reportData = await models.dibs_transaction.findAll({
            attributes: [
                'id',
                ['createdAt', 'saleDate'],
                'userid',
                'type',
                'description',
                'amount',
                ['studio_credits_spent', 'creditApplied'],
                'original_price',
                'tax_amount',
                'discount_amount',
                'purchasePlace',
                'stripe_fee',
                'dibs_fee',
                'studio_package_id'
            ],
            where: {
                dibs_studio_id: dibsStudioId,
                createdAt: {
                    [Op.between]: [startDate, endDate]
                },
                stripe_charge_id: {
                    [Op.ne]: null
                },
                stripe_refund_id: {
                    [Op.eq]: null
                },
                status: 1
            },
            include: [
                {
                    model: models.dibs_user,
                    attributes: ['id', 'firstName', 'lastName', 'email'],
                    as: 'user'
                },
                {
                    model: models.studio_packages,
                    attributes: ['id', 'name', 'classAmount', 'price'],
                    as: 'package'
                }
            ],
            order: [['createdAt']],
            void: false
        });
        console.log(`\n\n\n\n\nreportData: ${JSON.stringify(reportData)}`);
        res.json(apiSuccessWrapper({ reportData }, 'Successfully retrieved products'));
    } catch (err) {
        errorHelper.handleError({
            opsSubject: 'Get Sales Data Error',
            employeeid: dibsStudioId,
            res
        })(err);
    }
};
