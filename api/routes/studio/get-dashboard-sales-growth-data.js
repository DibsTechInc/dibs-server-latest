const models = require('@dibs-tech/models');
const moment = require('moment-timezone');

const {
    Sequelize: { Op },
    sequelize
} = models;

async function getDashboardSalesGrowthData(req, res) {
    const period = req.body.timeperiod;
    const periodstoshow = req.body.periodstoshow;
    console.log(`period = ${period}`);
    let membershipidarray;
    let singleidarray;
    let packageidarray;
    const totaldata = [];
    const membershipdata = [];
    const packagedata = [];
    const singledata = [];
    const retailrevenuedata = [];
    const giftcarddata = [];
    const cleanup = async (list) => list.map((l) => l.dataValues.id);
    const getmembershipids = async () =>
        models.studio_packages.findAll({
            attributes: ['id'],
            where: {
                dibs_studio_id: req.body.dibsStudioId,
                price: {
                    [Op.gt]: 0
                },
                priceAutopay: {
                    [Op.gt]: 0
                },
                [Op.or]: [
                    {
                        autopay: {
                            [Op.in]: ['ALLOW', 'FORCE']
                        }
                    },
                    {
                        unlimited: true
                    }
                ]
            }
        });
    const getsingleids = async () =>
        models.studio_packages.findAll({
            attributes: ['id'],
            where: {
                dibs_studio_id: req.body.dibsStudioId,
                price: {
                    [Op.gt]: 0
                },
                classAmount: 1
            }
        });

    const getregularpackageids = async (membershipIds, singleIds) =>
        models.studio_packages.findAll({
            attributes: ['id'],
            where: {
                dibs_studio_id: req.body.dibsStudioId,
                price: {
                    [Op.gt]: 0
                },
                id: {
                    [Op.and]: [
                        {
                            [Op.notIn]: membershipIds
                        },
                        {
                            [Op.notIn]: singleIds
                        }
                    ]
                }
            }
        });

    const setpackageids = async () => {
        membershipidarray = await getmembershipids().then((ids) => cleanup(ids));
        singleidarray = await getsingleids().then((ids) => cleanup(ids));
        packageidarray = await getregularpackageids(membershipidarray, singleidarray).then((ids) => cleanup(ids));
    };
    const retaildata = async (datefrom, dateto, i, type) => {
        const revData = await models.dibs_transaction.findAll({
            attributes: [
                [sequelize.fn('sum', sequelize.col('amount')), 'amount'],
                [sequelize.fn('sum', sequelize.col('studio_credits_spent')), 'studio_credits_spent']
            ],
            where: {
                dibs_studio_id: req.body.dibsStudioId,
                status: 1,
                stripe_charge_id: {
                    [Op.not]: null
                },
                type,
                stripe_refund_id: null,
                createdAt: {
                    [Op.between]: [datefrom, dateto]
                },
                void: false
            },
            paranoid: false
        });
        const valuetopush = Math.round(revData[0].amount - revData[0].studio_credits_spent);
        if (type === 'retail') {
            retailrevenuedata.splice(i, 0, valuetopush);
        } else {
            giftcarddata.splice(i, 0, valuetopush);
        }
    };
    const totalrevData = async (datefrom, dateto, i) => {
        const revData = await models.dibs_transaction.findAll({
            attributes: [
                [sequelize.fn('sum', sequelize.col('amount')), 'amount'],
                [sequelize.fn('sum', sequelize.col('studio_credits_spent')), 'studio_credits_spent']
            ],
            where: {
                dibs_studio_id: req.body.dibsStudioId,
                status: 1,
                stripe_charge_id: {
                    [Op.not]: null
                },
                stripe_refund_id: null,
                createdAt: {
                    [Op.between]: [datefrom, dateto]
                },
                void: false
            },
            paranoid: false
        });
        const valuetopush = Math.round(revData[0].amount - revData[0].studio_credits_spent);
        totaldata.splice(i, 0, valuetopush);
    };
    const classrevData = async (datefrom, dateto, i, type) => {
        let packageArray;
        if (type === 'membership') {
            packageArray = membershipidarray;
        } else if (type === 'singles') {
            packageArray = singleidarray;
        } else {
            packageArray = packageidarray;
        }
        const revData = await models.dibs_transaction.findAll({
            attributes: [
                [sequelize.fn('sum', sequelize.col('amount')), 'amount'],
                [sequelize.fn('sum', sequelize.col('studio_credits_spent')), 'studio_credits_spent']
            ],
            where: {
                dibs_studio_id: req.body.dibsStudioId,
                status: 1,
                stripe_charge_id: {
                    [Op.not]: null
                },
                studio_package_id: {
                    [Op.in]: packageArray
                },
                stripe_refund_id: null,
                createdAt: {
                    [Op.between]: [datefrom, dateto]
                },
                void: false
            },
            paranoid: false
        });
        let singleAddition = 0;
        if (type === 'singles') {
            // calculate singles that were not purchased with passes
            const singlerevData = await models.dibs_transaction.findAll({
                attributes: [
                    [sequelize.fn('sum', sequelize.col('amount')), 'amount'],
                    [sequelize.fn('sum', sequelize.col('studio_credits_spent')), 'studio_credits_spent']
                ],
                where: {
                    dibs_studio_id: req.body.dibsStudioId,
                    status: 1,
                    eventid: {
                        [Op.not]: null
                    },
                    stripe_charge_id: {
                        [Op.not]: null
                    },
                    stripe_refund_id: null,
                    createdAt: {
                        [Op.between]: [datefrom, dateto]
                    },
                    void: false
                },
                paranoid: false
            });
            singleAddition = singlerevData[0].amount - singlerevData[0].studio_credits_spent;
        }
        const valuetopush = Math.round(revData[0].amount - revData[0].studio_credits_spent + singleAddition);
        if (type === 'membership') {
            membershipdata.splice(i, 0, valuetopush);
        } else if (type === 'singles') {
            singledata.splice(i, 0, valuetopush);
        } else {
            packagedata.splice(i, 0, valuetopush);
        }
    };
    async function getRetailRevData(datefrom, dateto, i, type) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(retaildata(datefrom, dateto, i, type));
                reject(new Error('getNewRetailData timed out'));
            }, 2000);
        });
    }
    async function getRevenueTotals(datefrom, dateto, i) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(totalrevData(datefrom, dateto, i));
                reject(new Error('total revenue data timed out'));
            }, 2000);
        });
    }
    async function getAllRevData(datefrom, dateto, i, type) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(classrevData(datefrom, dateto, i, type));
                reject(new Error('revenue data by classtype timed out'));
            }, 2000);
        });
    }
    async function getAllPackageRevData(datefrom, dateto, i, type) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(classrevData(datefrom, dateto, i, type));
                reject(new Error('revenue data by classtype timed out'));
            }, 2000);
        });
    }
    // get the data for each package type
    const calculateDatesAndGetRevenue = async (timeperiod) => {
        const startOfThisPeriod = moment().startOf(timeperiod);
        let fromdate = startOfThisPeriod;
        let todate = moment().endOf(timeperiod);
        const promises = [];
        const promisesPackages = [];
        const promisesSingles = [];
        const promisesTotals = [];
        const promisesGifts = [];
        for (let i = 0; i < periodstoshow; i += 1) {
            console.log(`i = ${i}`);
            fromdate = moment().startOf(timeperiod).subtract(i, period);
            todate = moment().endOf(timeperiod).subtract(i, period);
            promises.push(getRetailRevData(fromdate, todate, i, 'retail'));
            promises.push(getAllRevData(fromdate, todate, i, 'membership'));
            promisesPackages.push(getAllPackageRevData(fromdate, todate, i, 'packages'));
            promisesSingles.push(getAllPackageRevData(fromdate, todate, i, 'singles'));
            promisesTotals.push(getRevenueTotals(fromdate, todate, i));
            promisesGifts.push(getRetailRevData(fromdate, todate, i, 'gift'));
        }
        await Promise.all(promises);
        await Promise.all(promisesPackages);
        await Promise.all(promisesSingles);
        await Promise.all(promisesTotals);
        await Promise.all(promisesGifts);
    };

    const getrevenuebypackage = async () => {
        await setpackageids();
        await calculateDatesAndGetRevenue(period)
            .then(() => {
                retailrevenuedata.reverse();
                membershipdata.reverse();
                packagedata.reverse();
                singledata.reverse();
                totaldata.reverse();
                giftcarddata.reverse();
                console.log(`\n\nfinished reversing the data`);
            })
            .then(() => {
                console.log(`\n\nsending a response now`);
                res.json({
                    success: true,
                    revenuedata: {
                        retail: retailrevenuedata,
                        memberships: membershipdata,
                        packages: packagedata,
                        singles: singledata,
                        giftcards: giftcarddata,
                        totals: totaldata
                    }
                });
            })
            .catch((err) =>
                res.status(500).json({
                    success: false,
                    message: err.message
                })
            );
    };

    await getrevenuebypackage();
    console.log(`\n\n\n\n ran getrevenuebypackage - retailrevenuedata: ${JSON.stringify(retailrevenuedata)}`);

    console.log(`singleids are: ${JSON.stringify(singleidarray)}`);
    console.log(`packageidarray are: ${JSON.stringify(packageidarray)}`);
    console.log(`membershipidarray are: ${JSON.stringify(membershipidarray)}`);
    console.log(`retailrevenuedata after reverse: ${JSON.stringify(retailrevenuedata)}`);
    console.log(`membershiprevenuedata is: ${JSON.stringify(membershipdata)}`);
    console.log(`packagedata is: ${JSON.stringify(packagedata)}`);
    console.log(`singles data is: ${JSON.stringify(singledata)}`);
    console.log(`totalsdata is: ${JSON.stringify(totaldata)}`);
    console.log(`giftcarddata is: ${JSON.stringify(giftcarddata)}\n\n\n\n`);
}

module.exports = getDashboardSalesGrowthData;
