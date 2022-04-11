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
    let totaldata;
    let membershipdata;
    let packagedata;
    let singledata;
    const retailrevenuedata = [];
    let otherdata;
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
        console.log(`\n\n\ndatefrom and to: ${datefrom} and ${dateto}`);
        console.log(`\n\nrevData returned after await - ${JSON.stringify(revData)}\n\n`);
        const valuetopush = revData[0].amount - revData[0].studio_credits_spent;
        console.log(`valuetopush is: ${valuetopush}`);
        retailrevenuedata.splice(i, 0, valuetopush);
    };
    async function getNewRetailData(datefrom, dateto, i) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(retaildata(datefrom, dateto, i));
                reject(new Error('getNewRetailData timed out'));
            }, 2000);
        });
    }
    // get the data for each package type
    const calculateDatesAndGetRevenue = async (timeperiod) => {
        const startOfThisPeriod = moment().startOf(timeperiod);
        let fromdate = startOfThisPeriod;
        let todate = moment().endOf(timeperiod);
        const promises = [];
        for (let i = 0; i < 12; i += 1) {
            console.log(`i = ${i}`);
            fromdate = moment().startOf(timeperiod).subtract(i, 'month');
            todate = moment().endOf(timeperiod).subtract(i, 'month');
            console.log(`fromdate = ${fromdate}`);
            console.log(`todate = ${todate}`);
            promises.push(getNewRetailData(fromdate, todate, i));
        }
        await Promise.all(promises);
    };

    const getrevenuebypackage = async () => {
        await setpackageids();
        await calculateDatesAndGetRevenue('month');
        // gettotal
        // getmembershipfirst
        // getsinglessecond
        // getpackageslast
        // getretail
        // getother
    };
    await getrevenuebypackage();
    console.log(`retailrevenuedata: ${JSON.stringify(retailrevenuedata)}`);
    retailrevenuedata.reverse();
    console.log(`retailrevenuedata after reverse: ${JSON.stringify(retailrevenuedata)}`);
}

module.exports = getDashboardSalesGrowthData;
