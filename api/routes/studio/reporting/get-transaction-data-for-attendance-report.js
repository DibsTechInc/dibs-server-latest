const errorHelper = require('../../../../lib/errors');

const {
    Sequelize: { Op }
} = models;

module.exports = async function getTransactionDataForAttendanceReport(req, res) {
    const { attendeeAsNumber } = req.body;
    try {
        console.log(`attendeeId from getTransactionData for attendance report is: ${attendeeAsNumber}`);
        const paymentData = { paymentTypeDB: 'Not yet set', grossRevenueDB: 0, netRevenueDB: 0 };
        const transactionData = await models.dibs_transaction.findOne({
            attributes: [
                'id',
                'stripe_charge_id',
                'status',
                'original_price',
                'tax_amount',
                'discount_amount',
                'stripe_fee',
                'dibs_fee',
                'with_passid',
                'studio_credits_spent'
            ],
            where: {
                id: attendeeAsNumber,
                status: 1
            }
        });
        if (transactionData.stripe_charge_id !== null && transactionData.studio_credits_spent === 0)
            paymentData.paymentTypeDB = 'Paid For Single Class';
        else if (transactionData.stripe_charge_id !== null && transactionData.studio_credits_spent > 0)
            paymentData.paymentTypeDB = 'Partial Studio Credits/Payment';
        else if (transactionData.stripe_charge_id === null && transactionData.studio_credits_spent > 0)
            paymentData.paymentTypeDB = 'Studio Credits';
        if (transactionData.with_passid !== null) {
            const passData = await models.passes.findOne({
                attributes: ['studio_package_id'],
                where: {
                    id: transactionData.with_passid
                }
            });
            const packageData = await models.studio_packages.findOne({
                attributes: ['name'],
                where: {
                    id: passData.studio_package_id
                }
            });
            paymentData.paymentTypeDB = packageData.name;
        }
        console.log(`\n\n\n\n3 - transactionData is: ${JSON.stringify(transactionData)}\n\n\n`);
        res.json(apiSuccessWrapper({ paymentData }, 'Successfully retrieved transaction data for the attendance report'));
    } catch (err) {
        errorHelper.handleError({
            opsSubject: 'Get Transaction Data for Attendance Report Error - employeeId is transaction id',
            employeeid: attendeeAsNumber,
            res
        })(err);
    }
};
