const models = require('@dibs-tech/models');
const moment = require('moment-timezone');

const {
    Sequelize: { Op },
    sequelize
} = models;

async function getDashboardSalesGrowthData(req, res) {
    const timeperiod = req.body.timeperiod;
    const memberdataseries = [];
    const packagedataseries = [];
    const singledataseries = [];
    const retaildataseries = [];
    try {
        const assignIdsForMembers = async () => {
            const membershippackageids = await models.studio_packages.findAll({
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
            return membershippackageids.map((packageid) => {
                const packageidvalue = packageid.dataValues.id;
                return packageidvalue;
            });
        };
        const assignIdsForSingles = async () => {
            const singlepackageids = await models.studio_packages.findAll({
                attributes: ['id'],
                where: {
                    dibs_studio_id: req.body.dibsStudioId,
                    price: {
                        [Op.gt]: 0
                    },
                    classAmount: 1
                }
            });
            return singlepackageids.map((packageid) => {
                const packageidvalue = packageid.dataValues.id;
                return packageidvalue;
            });
        };
        const assignIdsForPackages = async (singleIds, membershipIds) => {
            console.log(`singleIds: ${JSON.stringify(singleIds)}`);
            console.log(`membershipIds: ${JSON.stringify(membershipIds)}`);
            const regularpackageids = await models.studio_packages.findAll({
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
            return regularpackageids.map((packageid) => packageid.dataValues.id);
        };
        const membershipids = await assignIdsForMembers();
        const singleids = await assignIdsForSingles().then((singleIds) => {
            );
        console.log(`\n\n\n\nmembershipids - ${JSON.stringify(membershipids)}`);
        console.log(`singleids - ${JSON.stringify(singleids)}`);
        const regularpackids = await assignIdsForPackages(singleids, membershipids);
        console.log(`package ids is: ${JSON.stringify(regularpackids)}\n\n\n\n`);
        return membershipids;
    } catch (err) {
        console.log(`error in getDashboardSalesGrowthData api call: ${err}`);
        return err;
    }
}

// find membership studio package ids
//     const membershippackageids = await models.studio_packages.findAll({
//         attributes: ['id'],
//         where: {
//             dibs_studio_id: req.body.dibsStudioId,
//             price: {
//                 [Op.gt]: 0
//             },
//             priceAutopay: {
//                 [Op.gt]: 0
//             },
//             [Op.or]: [
//                 {
//                     autopay: {
//                         [Op.in]: ['ALLOW', 'FORCE']
//                     }
//                 },
//                 {
//                     unlimited: true
//                 }
//             ]
//         }
//     });
//     // return only the membership ids

//     // singles packages
//     const singles = await models.studio_packages.findAll({
//         attributes: ['id'],
//         where: {
//             dibs_studio_id: req.body.dibsStudioId,
//             price: {
//                 [Op.gt]: 0
//             },
//             classAmount: 1
//         }
//     });
//     console.log(`check here - singles are not including 8919 and 8921 -> ${JSON.stringify(singles)}`);
//     const singleIds = await singles.map((packageid) => {
//         const packageidvalue = packageid.dataValues.id;
//         console.log(`packageidvalue is: ${packageidvalue}`);
//         // packageids.push(packageidvalue);
//         return packageidvalue;
//     });
//     // packages - not autopay and not unlimited
//     console.log(`1234 here - membershipIds are: ${JSON.stringify(membershipIds)}`);
//     console.log(`singleIds are: ${JSON.stringify(singleIds)}`);
//     const allpackagesremaining = await models.studio_packages.findAll({
//         attributes: ['id', 'name', 'classAmount'],
//         available: true,
//         where: {
//             dibs_studio_id: req.body.dibsStudioId,
//             price: {
//                 [Op.gt]: 0
//             }
//         }
//     });
//     const leftovers = allpackagesremaining.filter((pack) => {
//         let includedalready = 0;
//         if (singleIds.includes(pack.dataValues.id)) {
//             includedalready += 1;
//             // return false;
//         }
//         if (membershipIds.includes(pack.dataValues.id)) {
//             includedalready += 1;
//             // return false;
//         }
//         if (packageIds.includes(pack.dataValues.id)) {
//             includedalready += 1;
//             // return false;
//         }
//         if (includedalready >= 0) {
//             return false;
//         }
//         console.log(`it is not contained anywhere`);
//         console.log(`THROW BETTER ERROR HERE`);
//         return true;
//     });
//     async function getRevenueForTimePeriod(fromDate, toDate) {
//         // GET TOTAL REVENUE
//         const totalRevenue = await models.dibs_transaction.findAll({
//             attributes: [
//                 [sequelize.fn('sum', sequelize.col('amount')), 'sumAmount'],
//                 [sequelize.fn('sum', sequelize.col('studio_credits_spent')), 'credits_spent']
//             ],
//             where: {
//                 dibs_studio_id: req.body.dibsStudioId,
//                 status: 1,
//                 stripe_charge_id: {
//                     [Op.ne]: null
//                 },
//                 stripe_refund_id: null,
//                 createdAt: {
//                     [Op.gte]: fromDate,
//                     [Op.lte]: toDate
//                 },
//                 void: false
//             },
//             paranoid: false
//         });
//         // GET MEMBERSHIP REVENUE
//         const membershiprevenue = await models.dibs_transaction.findAll({
//             attributes: [
//                 [sequelize.fn('sum', sequelize.col('amount')), 'sumAmount'],
//                 [sequelize.fn('sum', sequelize.col('studio_credits_spent')), 'credits_spent']
//             ],
//             where: {
//                 dibs_studio_id: req.body.dibsStudioId,
//                 status: 1,
//                 stripe_charge_id: {
//                     [Op.ne]: null
//                 },
//                 stripe_refund_id: null,
//                 createdAt: {
//                     [Op.gte]: fromDate,
//                     [Op.lte]: toDate
//                 },
//                 void: false,
//                 studio_package_id: {
//                     [Op.in]: membershipIds
//                 }
//             },
//             paranoid: false
//         });
//         // GET PACKAGE REVENUE
//         const packagerevenue = await models.dibs_transaction.findAll({
//             attributes: [
//                 [sequelize.fn('sum', sequelize.col('amount')), 'sumAmount'],
//                 [sequelize.fn('sum', sequelize.col('studio_credits_spent')), 'credits_spent']
//             ],
//             where: {
//                 dibs_studio_id: req.body.dibsStudioId,
//                 status: 1,
//                 stripe_charge_id: {
//                     [Op.ne]: null
//                 },
//                 stripe_refund_id: null,
//                 createdAt: {
//                     [Op.gte]: fromDate,
//                     [Op.lte]: toDate
//                 },
//                 void: false,
//                 studio_package_id: {
//                     [Op.in]: packageIds
//                 }
//             },
//             paranoid: false
//         });
//         // GET SINGLE REVENUE
//         const singlerevenue = await models.dibs_transaction.findAll({
//             attributes: [
//                 [sequelize.fn('sum', sequelize.col('amount')), 'sumAmount'],
//                 [sequelize.fn('sum', sequelize.col('studio_credits_spent')), 'credits_spent']
//             ],
//             where: {
//                 dibs_studio_id: req.body.dibsStudioId,
//                 status: 1,
//                 stripe_charge_id: {
//                     [Op.ne]: null
//                 },
//                 stripe_refund_id: null,
//                 createdAt: {
//                     [Op.gte]: fromDate,
//                     [Op.lte]: toDate
//                 },
//                 void: false,
//                 studio_package_id: {
//                     [Op.in]: singleIds
//                 }
//             },
//             paranoid: false
//         });
//         // GET SINGLE REVENUE WITH NO PACKAGE
//         const singleRevenueNoPack = await models.dibs_transaction.findAll({
//             attributes: [
//                 [sequelize.fn('sum', sequelize.col('amount')), 'sumAmount'],
//                 [sequelize.fn('sum', sequelize.col('studio_credits_spent')), 'credits_spent']
//             ],
//             where: {
//                 dibs_studio_id: req.body.dibsStudioId,
//                 status: 1,
//                 stripe_charge_id: {
//                     [Op.ne]: null
//                 },
//                 stripe_refund_id: null,
//                 createdAt: {
//                     [Op.gte]: fromDate,
//                     [Op.lte]: toDate
//                 },
//                 void: false,
//                 eventid: {
//                     [Op.ne]: null
//                 },
//                 studio_package_id: null
//             },
//             paranoid: false
//         });
//         // GET RETAIL REVENUE
//         const retailRevenue = await models.dibs_transaction.findAll({
//             attributes: [
//                 [sequelize.fn('sum', sequelize.col('amount')), 'sumAmount'],
//                 [sequelize.fn('sum', sequelize.col('studio_credits_spent')), 'credits_spent']
//             ],
//             where: {
//                 dibs_studio_id: req.body.dibsStudioId,
//                 status: 1,
//                 stripe_charge_id: {
//                     [Op.ne]: null
//                 },
//                 stripe_refund_id: null,
//                 createdAt: {
//                     [Op.gte]: fromDate,
//                     [Op.lte]: toDate
//                 },
//                 void: false,
//                 type: 'retail'
//             },
//             paranoid: false
//         });
//         // NEXT - PUT IT ALL TOGETHER
//         const totalAmount = totalRevenue[0].dataValues.sumAmount;
//         const tootalCreditsSpent = totalRevenue[0].dataValues.credits_spent;
//         const totalValue = totalAmount - tootalCreditsSpent;
//         const membershipAmount = membershiprevenue[0].dataValues.sumAmount;
//         const membershipcreditSpent = membershiprevenue[0].dataValues.credits_spent;
//         const totalMembershipRevenue = membershipAmount - membershipcreditSpent;
//         const packageAmount = packagerevenue[0].dataValues.sumAmount;
//         const packageCreditsSpent = packagerevenue[0].dataValues.credits_spent;
//         const totalPackageRevenue = packageAmount - packageCreditsSpent;
//         const singleAmount = singlerevenue[0].dataValues.sumAmount;
//         const singleCreditsSpent = singlerevenue[0].dataValues.credits_spent;
//         const totalSingleRevenue = singleAmount - singleCreditsSpent;
//         const singleRevenueNoPackAmount = singleRevenueNoPack[0].dataValues.sumAmount;
//         const singleRevenueNoPackCreditsSpent = singleRevenueNoPack[0].dataValues.credits_spent;
//         const totalSingleRevenueNoPack = singleRevenueNoPackAmount - singleRevenueNoPackCreditsSpent;
//         const singleAllTogether = totalSingleRevenue + totalSingleRevenueNoPack;
//         const retailAmount = retailRevenue[0].dataValues.sumAmount;
//         const retailCreditsSpent = retailRevenue[0].dataValues.credits_spent;
//         const totalRetailRevenue = retailAmount - retailCreditsSpent;
//         const revenueObject = {
//             totalRevenue: totalValue,
//             membershipRevenue: totalMembershipRevenue,
//             packageRevenue: totalPackageRevenue,
//             singleRevenue: singleAllTogether,
//             retailRevenue: totalRetailRevenue
//         };
//         console.log(`\n\n\nhere - v2 - revenueArray: ${JSON.stringify(revenueObject)}\n\n\n\n\n`);
//         return { revenueObject };
//     }
//     // get total revenue data series
//     // start with this period

//     const thisperiod = moment().startOf(timeperiod);
//     const nowtime = moment();
//     const thisperiodrevenue = await getRevenueForTimePeriod(thisperiod, nowtime);
//     memberdataseries.push(thisperiodrevenue.membershipRevenue);
//     packagedataseries.push(thisperiodrevenue.packageRevenue);
//     singledataseries.push(thisperiodrevenue.singleRevenue);
//     retaildataseries.push(thisperiodrevenue.retailRevenue);
//     async function getSeriesData() {
//         // const dataseries = [];
//         for (let i = 1; i < 12; i += 1) {
//             // Good: all asynchronous operations are immediately started.
//             const period = moment(thisperiod).subtract(i, timeperiod);
//             const endofperiod = moment(period).endOf(timeperiod);
//             const revenueforperiod = getRevenueForTimePeriod(period, endofperiod);
//             memberdataseries.splice(i, 0, revenueforperiod.membershipRevenue);
//             packagedataseries.splice(i, 0, revenueforperiod.packageRevenue);
//             singledataseries.splice(i, 0, revenueforperiod.singleRevenue);
//             retaildataseries.splice(i, 0, revenueforperiod.retailRevenue);
//         }
//         // Now that all the asynchronous operations are running, here we wait until they all complete.
//         const [revMembers, revPackages, revSingles, revRetail] = await Promise.all([
//             Promise.all(memberdataseries),
//             Promise.all(packagedataseries),
//             Promise.all(singledataseries),
//             Promise.all(retaildataseries)
//         ]);
//         // return Promise.all(dataseries);
//         return {
//             memberdataseries: revMembers,
//             packagedataseries: revPackages,
//             singledataseries: revSingles,
//             retaildataseries: revRetail
//         };
//     }
//     await getSeriesData();
//     // contdataseries.reverse();
//     console.log(`memberdataseries is: ${JSON.stringify(memberdataseries)}`);
//     // console.log(`after all of that - the dataseries to return is: ${JSON.stringify(contdataseries)}`);
//     res.json({
//         msg: 'success',
//         data: [1, 2, 3, 4, 5]
//     });
// }

module.exports = getDashboardSalesGrowthData;
