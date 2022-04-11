const models = require('@dibs-tech/models');
const moment = require('moment-timezone');

const {
    Sequelize: { Op },
    sequelize
} = models;

async function getDashboardSalesGrowthData(req, res) {
    let membershipidarray;
    let singleidarray;
    let packageidarray;
    const totaldata = [];
    const membershipdata = [];
    const packagedata = [];
    const singledata = [];
    const retailrevenuedata = [];
    const otherdata = [];
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
    const retaildata = async (datefrom, dateto, i) => {
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
                type: 'retail',
                stripe_refund_id: null,
                createdAt: {
                    [Op.between]: [datefrom, dateto]
                },
                void: false
            },
            paranoid: false
        });
        const valuetopush = revData[0].amount - revData[0].studio_credits_spent;
        retailrevenuedata.splice(i, 0, valuetopush);
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
        const valuetopush = revData[0].amount - revData[0].studio_credits_spent;
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
        const valuetopush = revData[0].amount - revData[0].studio_credits_spent;
        if (type === 'membership') {
            membershipdata.splice(i, 0, valuetopush);
        } else if (type === 'singles') {
            singledata.splice(i, 0, valuetopush);
        } else {
            packagedata.splice(i, 0, valuetopush);
        }
    };
    async function getRetailRevData(datefrom, dateto, i) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(retaildata(datefrom, dateto, i));
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
    async function calculateRemainderAllData(index) {
        const valuetoAddToOther =
            totaldata[index] - (membershipdata[index] + packagedata[index] + singledata[index] + retailrevenuedata[index]);
        otherdata.splice(index, 0, valuetoAddToOther);
    }
    async function getOtherData(i) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(calculateRemainderAllData(i));
                reject(new Error('other category - revenue data timed out'));
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
        for (let i = 0; i < 12; i += 1) {
            console.log(`i = ${i}`);
            fromdate = moment().startOf(timeperiod).subtract(i, 'month');
            todate = moment().endOf(timeperiod).subtract(i, 'month');
            promises.push(getRetailRevData(fromdate, todate, i));
            promises.push(getAllRevData(fromdate, todate, i, 'membership'));
            promisesPackages.push(getAllPackageRevData(fromdate, todate, i, 'packages'));
            promisesSingles.push(getAllPackageRevData(fromdate, todate, i, 'singles'));
            promisesTotals.push(getRevenueTotals(fromdate, todate, i));
        }
        await Promise.all(promises);
        await Promise.all(promisesPackages);
        await Promise.all(promisesSingles);
        await Promise.all(promisesTotals);
    };
    const calculateRemainders = async () => {
        const promises = [];
        totaldata.map((value, index) => {
            promises.push(getOtherData(index));
            return value;
        });
        await Promise.all(promises);
    };

    const getrevenuebypackage = async () => {
        await setpackageids();
        await calculateDatesAndGetRevenue('month');
        await calculateRemainders();
    };

    await getrevenuebypackage();
    console.log(`\n\n\n\nretailrevenuedata: ${JSON.stringify(retailrevenuedata)}`);
    retailrevenuedata.reverse();
    membershipdata.reverse();
    packagedata.reverse();
    singledata.reverse();
    totaldata.reverse();
    otherdata.reverse();
    console.log(`retailrevenuedata after reverse: ${JSON.stringify(retailrevenuedata)}`);
    console.log(`membershiprevenuedata is: ${JSON.stringify(membershipdata)}`);
    console.log(`packagedata is: ${JSON.stringify(packagedata)}`);
    console.log(`singles data is: ${JSON.stringify(singledata)}`);
    console.log(`totalsdata is: ${JSON.stringify(totaldata)}`);
    console.log(`otherdata is: ${JSON.stringify(otherdata)}\n\n\n\n`);
}

module.exports = getDashboardSalesGrowthData;
