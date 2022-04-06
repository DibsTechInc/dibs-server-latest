const models = require('@dibs-tech/models');
const moment = require('moment-timezone');

const {
    Sequelize: { Op }
} = models;

async function getDashboardData(req, res) {
    try {
        console.log(`dibsid is: ${req.body.dibsStudioId}`);
        // today
        const revenueToday = await models.dibs_transaction.sum('amount', {
            where: {
                dibs_studio_id: req.body.dibsStudioId,
                status: 1,
                stripe_charge_id: {
                    [Op.ne]: null
                },
                stripe_refund_id: null,
                createdAt: {
                    [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0))
                },
                void: false
            }
        });
        const creditsSpentToday = await models.dibs_transaction.sum('studio_credits_spent', {
            where: {
                dibs_studio_id: req.body.dibsStudioId,
                status: 1,
                stripe_charge_id: {
                    [Op.ne]: null
                },
                stripe_refund_id: null,
                createdAt: {
                    [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0))
                },
                void: false
            }
        });
        const todaySpend = revenueToday - creditsSpentToday;
        // this week
        const today = moment();
        moment().tz('America/New_York').format();
        const fromDateWeek = today.startOf('week');
        const revenueWeek = await models.dibs_transaction.sum('amount', {
            where: {
                dibs_studio_id: req.body.dibsStudioId,
                status: 1,
                stripe_charge_id: {
                    [Op.ne]: null
                },
                stripe_refund_id: null,
                createdAt: {
                    [Op.gte]: fromDateWeek
                },
                void: false
            }
        });
        const creditsSpentWeek = await models.dibs_transaction.sum('studio_credits_spent', {
            where: {
                dibs_studio_id: req.body.dibsStudioId,
                status: 1,
                stripe_charge_id: {
                    [Op.ne]: null
                },
                stripe_refund_id: null,
                createdAt: {
                    [Op.gte]: fromDateWeek
                },
                void: false
            }
        });
        const weekspend = revenueWeek - creditsSpentWeek;
        // this month
        const month = moment();
        moment().tz('America/New_York').format();
        const fromDateMonth = month.startOf('month');
        const revenueMonth = await models.dibs_transaction.sum('amount', {
            where: {
                dibs_studio_id: req.body.dibsStudioId,
                status: 1,
                stripe_charge_id: {
                    [Op.ne]: null
                },
                stripe_refund_id: null,
                createdAt: {
                    [Op.gte]: fromDateMonth
                },
                void: false
            }
        });
        console.log(`revenue month is: ${revenueMonth}`);
        const creditsSpentMonth = await models.dibs_transaction.sum('studio_credits_spent', {
            where: {
                dibs_studio_id: req.body.dibsStudioId,
                status: 1,
                stripe_charge_id: {
                    [Op.ne]: null
                },
                stripe_refund_id: null,
                createdAt: {
                    [Op.gte]: fromDateMonth
                },
                void: false
            }
        });
        const monthspend = revenueMonth - creditsSpentMonth;
        // this year
        const year = moment();
        moment().tz('America/New_York').format();
        const fromDateYear = year.startOf('year');
        console.log(`fromDateYear is: ${fromDateYear}`);
        const revenueYear = await models.dibs_transaction.sum('amount', {
            where: {
                dibs_studio_id: req.body.dibsStudioId,
                status: 1,
                stripe_charge_id: {
                    [Op.ne]: null
                },
                stripe_refund_id: null,
                createdAt: {
                    [Op.gte]: fromDateYear
                },
                void: false
            }
        });
        console.log(`revenue year is: ${revenueYear}`);
        const creditsSpentYear = await models.dibs_transaction.sum('studio_credits_spent', {
            where: {
                dibs_studio_id: req.body.dibsStudioId,
                status: 1,
                stripe_charge_id: {
                    [Op.ne]: null
                },
                stripe_refund_id: null,
                createdAt: {
                    [Op.gte]: fromDateYear
                },
                void: false
            }
        });
        console.log(`creditsSpentYear is: ${creditsSpentYear}`);
        const yearspend = revenueYear - creditsSpentYear;
        // this year
        const todayspendformatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
            minimumFractionDigits: 0
        }).format(todaySpend);
        const weekspendFormatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
            minimumFractionDigits: 0
        }).format(weekspend);
        const monthSpendFormatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
            minimumFractionDigits: 0
        }).format(monthspend);
        const yearspendFormatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
            minimumFractionDigits: 0
        }).format(yearspend);

        const revenuetotals = [
            {
                label: 'TODAY',
                value: `${todayspendformatted}`,
                up: 1,
                comparedwith: 'yesterday',
                percentage: 0
            },
            {
                label: 'THIS WEEK',
                value: `${weekspendFormatted}`,
                up: 1,
                comparedwith: 'last week',
                percentage: 0
            },
            {
                label: 'THIS MONTH',
                value: `${monthSpendFormatted}`,
                up: 1,
                comparedwith: 'last month',
                percentage: 0
            },
            {
                label: 'THIS YEAR',
                value: `${yearspendFormatted}`,
                up: 1,
                comparedwith: 'last year',
                percentage: 0
            }
        ];
        res.json({
            msg: 'success',
            revenuetotals
        });
    } catch (err) {
        console.log(`error in getDashboardData api call: ${err}`);
        return err;
    }
    return { msg: 'failure - getDashboardData' };
}

module.exports = getDashboardData;
