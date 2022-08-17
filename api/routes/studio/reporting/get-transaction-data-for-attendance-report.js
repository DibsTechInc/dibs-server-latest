const errorHelper = require('../../../../lib/errors');

const {
    Sequelize: { Op }
} = models;

module.exports = async function getTransactionDataForAttendanceReport(req, res) {
    const { attendeeAsNumber } = req.body;
    const membershipGross = 19;
    const membershipNet = 18.22;
    const membershipText = 'Unlimited Membership';
    try {
        console.log(`attendeeId from getTransactionData for attendance report is: ${attendeeAsNumber}`);
        const paymentData = { paymentTypeDB: 'Not yet set', grossRevenueDB: 0, netRevenueDB: 0 };
        const transactionData = await models.dibs_transaction.findOne({
            attributes: [
                'id',
                'stripe_charge_id',
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
            },
            paranoid: false
        });
        console.log(`\n\n\n\n\n\ntransactionData for this attendee id ${attendeeAsNumber} is: ${JSON.stringify(transactionData)}\n\n\n\n`);
        const updateDibsTransRevData = async (gr, fees, taxes, nr) => {
            console.log(`id = ${attendeeAsNumber} gr = ${gr}, fees = ${fees}, taxes = ${taxes}, nr = ${nr}`);
            models.dibs_transaction.update(
                {
                    rev_to_attribute: gr,
                    swipe_fees_to_attribute: fees,
                    tax_to_attribute: taxes,
                    net_rev_to_attribute: nr
                },
                {
                    where: {
                        id: attendeeAsNumber
                    }
                }
            );
            console.log(`just made the dibs transaction update for dt row ${attendeeAsNumber}`);
        };
        // direct charge no studio credits spent
        if (transactionData.stripe_charge_id !== null && transactionData.studio_credits_spent === 0) {
            paymentData.paymentTypeDB = 'Paid For Single Class';
            paymentData.grossRevenueDB = transactionData.original_price - transactionData.discount_amount;
            paymentData.netRevenueDB =
                paymentData.grossRevenueDB - transactionData.tax_amount - transactionData.stripe_fee - transactionData.dibs_fee;
            const fees = transactionData.stripe_fee + transactionData.dibs_fee;
            updateDibsTransRevData(paymentData.grossRevenueDB, fees, transactionData.tax_amount, paymentData.netRevenueDB);
        }
        // class was purchased with a package
        if (transactionData.with_passid !== null) {
            const passData = await models.passes.findOne({
                attributes: ['studio_package_id', 'totalUses'],
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
            // find out how much they paid for the package (not unlimited)
            const packagePriceInfo = await models.dibs_transaction.findOne({
                attributes: [
                    'amount',
                    'discount_amount',
                    'studio_credits_spent',
                    'stripe_charge_id',
                    'tax_amount',
                    'stripe_fee',
                    'dibs_fee'
                ],
                where: {
                    for_passid: transactionData.with_passid
                }
            });
            console.log(
                `\n\n\n\n%%%%%%%%%%%%%%%%%%\n\nThey bought with a package\npackagePriceInfo for attendeeId: ${attendeeAsNumber} is: ${JSON.stringify(
                    packagePriceInfo
                )}\n\n\n\n\n\n`
            );
            if (passData.totalUses <= 80) {
                const grossRev = (packagePriceInfo.amount - packagePriceInfo.discount_amount) / passData.totalUses;
                const netRev =
                    (packagePriceInfo.amount -
                        packagePriceInfo.discount_amount -
                        packagePriceInfo.tax_amount -
                        packagePriceInfo.stripe_fee -
                        packagePriceInfo.dibs_fee) /
                    passData.totalUses;
                paymentData.grossRevenueDB = grossRev;
                paymentData.netRevenueDB = netRev;
            } else {
                // need to figure out what the unlimited membership amount is
                // next - set the membership price before calling the report
                paymentData.paymentTypeDB = membershipText;
                paymentData.grossRevenueDB = membershipGross;
                paymentData.netRevenueDB = membershipNet;
            }
        }
        // class was purchased with studio credits
        res.json(apiSuccessWrapper({ paymentData }, 'Successfully retrieved transaction data for the attendance report'));
    } catch (err) {
        errorHelper.handleError({
            opsSubject: 'Get Transaction Data for Attendance Report Error - employeeId is transaction id',
            employeeid: attendeeAsNumber,
            res
        })(err);
    }
};
