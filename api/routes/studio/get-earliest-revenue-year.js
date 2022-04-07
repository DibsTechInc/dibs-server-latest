const models = require('@dibs-tech/models');

const {
    Sequelize: { Op }
} = models;

async function getEarliestRevenueYear(req, res) {
    try {
        console.log(`\n\n\ngetEarliestRevenueYear - ${req.body.dibsStudioId}\n\n\n`);
        const minDate = await models.dibs_transaction.min('createdAt', {
            where: {
                dibs_studio_id: req.body.dibsStudioId,
                status: 1,
                void: false,
                stripe_charge_id: {
                    [Op.ne]: null
                },
                stripe_refund_id: {
                    [Op.eq]: null
                }
            }
        });
        console.log(`minDate is: ${JSON.stringify(minDate)}`);
        res.json({
            msg: 'success',
            minDate
        });
    } catch (err) {
        console.log(`error in getEarliestRevenueYear api call: ${err}`);
        return err;
    }
    return { msg: 'failure - getEarliestRevenueYear' };
}

module.exports = getEarliestRevenueYear;
