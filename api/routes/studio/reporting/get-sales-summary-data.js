const errorHelper = require('../../../../lib/errors');

const {
    Sequelize: { Op }
} = models;

module.exports = async function getSalesSummaryData(req, res) {
    const { dibsStudioId, salesInfo } = req.body;
    const { startDate, endDate } = salesInfo;
    const formatToDollars = (num) => {
        const todayspendformatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
            // maximumFractionDigits: 0,
            // minimumFractionDigits: 0
        }).format(num);
        return todayspendformatted;
    };
    const returnValues = [];
    try {
        const amountSum = await models.dibs_transaction.sum('amount', {
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
                status: 1,
                void: false
            }
        });
        const creditSpentSum = await models.dibs_transaction.sum('studio_credits_spent', {
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
                status: 1,
                void: false
            }
        });
        const taxWithheld = await models.dibs_transaction.sum('tax_withheld', {
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
                status: 1,
                void: false
            }
        });
        const stripeFee = await models.dibs_transaction.sum('stripe_fee', {
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
                status: 1,
                void: false
            }
        });
        const dibsFee = await models.dibs_transaction.sum('dibs_fee', {
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
                status: 1,
                void: false
            }
        });
        const grossRevenueSum = amountSum - creditSpentSum;
        const netRevenue = grossRevenueSum - taxWithheld - stripeFee - dibsFee;
        returnValues.push(formatToDollars(grossRevenueSum));
        returnValues.push(formatToDollars(taxWithheld));
        returnValues.push(formatToDollars(stripeFee));
        returnValues.push(formatToDollars(dibsFee));
        returnValues.push(formatToDollars(netRevenue));
        res.json(apiSuccessWrapper({ returnValues }, 'Successfully retrieved sales summary data'));
    } catch (err) {
        errorHelper.handleError({
            opsSubject: 'Get Sales Summary Data Error',
            employeeid: dibsStudioId,
            res
        })(err);
    }
};
