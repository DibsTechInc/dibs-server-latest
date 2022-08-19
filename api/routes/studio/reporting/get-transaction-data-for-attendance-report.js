const errorHelper = require('../../../../lib/errors');

const {
    Sequelize: { Op }
} = models;

module.exports = async function getTransactionDataForAttendanceReport(req, res) {
    const { attendeeAsNumber } = req.body;
    const membershipText = 'Unlimited Membership';
    try {
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
                'studio_credits_spent',
                'createdAt',
                'dibs_studio_id'
            ],
            where: {
                id: attendeeAsNumber,
                status: 1
            },
            paranoid: false
        });
        const updateDibsTransRevData = async (gr, fees, taxes, nr) => {
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
                attributes: ['name', 'unlimited'],
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
            if (passData.totalUses <= 80 && passData.totalUses !== null) {
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
                // } else if (passData.totalUses > 80 || packageData.unlimited || passData.totalUses === null) {
            } else {
                // need to figure out what the unlimited membership amount is
                const dibsStudioId = transactionData.dibs_studio_id;
                const dateToCompare = transactionData.createdAt;
                const membershipRevData = await models.membership_stats.findOne({
                    attributes: ['rev_per_visit', 'net_rev_per_visit'],
                    where: {
                        dibs_studio_id: dibsStudioId,
                        valid_from: {
                            [Op.lte]: dateToCompare
                        },
                        valid_to: {
                            [Op.gte]: dateToCompare
                        }
                    }
                });
                // eslint-disable-next-line camelcase
                const { rev_per_visit, net_rev_per_visit } = membershipRevData;
                paymentData.paymentTypeDB = membershipText;
                // eslint-disable-next-line camelcase
                paymentData.grossRevenueDB = rev_per_visit;
                // eslint-disable-next-line camelcase
                paymentData.netRevenueDB = net_rev_per_visit;
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
