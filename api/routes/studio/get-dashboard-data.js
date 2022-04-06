const models = require('@dibs-tech/models');
const moment = require('moment-timezone');

const {
    Sequelize: { Op }
} = models;

async function getDashboardData(req, res) {
    async function compareValue(category, fromDate) {
        let compareFromDate;
        let compareToDate;
        if (category === 'year') {
            compareFromDate = moment(fromDate).subtract(1, 'year').format('YYYY-MM-DD HH:mm:ss');
            compareToDate = moment().subtract(1, 'year').format('YYYY-MM-DD HH:mm:ss');
        } else if (category === 'month') {
            compareFromDate = moment(fromDate).subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss');
            compareToDate = moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss');
        } else if (category === 'week') {
            compareFromDate = moment(fromDate).subtract(1, 'week').format('YYYY-MM-DD HH:mm:ss');
            compareToDate = moment().subtract(1, 'week').format('YYYY-MM-DD HH:mm:ss');
        } else {
            compareFromDate = moment(fromDate).subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss');
            compareToDate = moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss');
        }
        const amount = await models.dibs_transaction.sum('amount', {
            where: {
                dibs_studio_id: req.body.dibsStudioId,
                status: 1,
                stripe_charge_id: {
                    [Op.ne]: null
                },
                stripe_refund_id: null,
                createdAt: {
                    [Op.gte]: compareFromDate,
                    [Op.lte]: compareToDate
                },
                void: false
            }
        });
        const studioCreditsSpent = await models.dibs_transaction.sum('studio_credits_spent', {
            where: {
                dibs_studio_id: req.body.dibsStudioId,
                status: 1,
                stripe_charge_id: {
                    [Op.ne]: null
                },
                stripe_refund_id: null,
                createdAt: {
                    [Op.gte]: compareFromDate,
                    [Op.lte]: compareToDate
                },
                void: false
            }
        });
        const totalValue = amount - studioCreditsSpent;
        return totalValue;
    }
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
        let comparisonweek = 0;
        compareValue('week', fromDateWeek).then((value) => {
            console.log(`\n\nlast week spend: ${value}`);
            console.log(`this week: ${weekspend}`);
            comparisonweek = 100 * ((weekspend - value) / value).toFixed(2);
        });
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
        let comparisonmonth = 0;
        compareValue('month', fromDateMonth).then((value) => {
            console.log(`\n\nlast month spend: ${value}`);
            console.log(`this month: ${monthspend}`);
            comparisonmonth = 100 * ((monthspend - value) / value).toFixed(2);
        });
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
        const yearspend = revenueYear - creditsSpentYear;
        let comparisonyoy = 0;
        await compareValue('year', fromDateYear).then((value) => {
            comparisonyoy = 100 * ((yearspend - value) / value).toFixed(2);
        });
        // comparisons
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
                up: comparisonweek >= 0 ? 1 : 0,
                comparedwith: 'last week',
                percentage: comparisonweek
            },
            {
                label: 'THIS MONTH',
                value: `${monthSpendFormatted}`,
                up: comparisonmonth >= 0 ? 1 : 0,
                comparedwith: 'last month',
                percentage: comparisonmonth
            },
            {
                label: 'THIS YEAR',
                value: `${yearspendFormatted}`,
                up: comparisonyoy >= 0 ? 1 : 0,
                comparedwith: 'last year',
                percentage: comparisonyoy
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
