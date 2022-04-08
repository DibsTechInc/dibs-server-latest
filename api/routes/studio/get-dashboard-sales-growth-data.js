const models = require('@dibs-tech/models');
const moment = require('moment-timezone');

const {
    Sequelize: { Op },
    sequelize
} = models;

async function getDashboardSalesGrowthData(req, res) {
    const timeperiod = req.body.timeperiod;
    // find membership studio package ids
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
    // return only the membership ids
    const membershipIds = await membershippackageids.map((packageid) => {
        const packageidvalue = packageid.dataValues.id;
        console.log(`packageidvalue is: ${packageidvalue}`);
        // packageids.push(packageidvalue);
        return packageidvalue;
    });
    // singles packages
    const singles = await models.studio_packages.findAll({
        attributes: ['id'],
        where: {
            dibs_studio_id: req.body.dibsStudioId,
            price: {
                [Op.gt]: 0
            },
            classAmount: 1
        }
    });
    console.log(`check here - singles are not including 8919 and 8921 -> ${JSON.stringify(singles)}`);
    const singleIds = await singles.map((packageid) => {
        const packageidvalue = packageid.dataValues.id;
        console.log(`packageidvalue is: ${packageidvalue}`);
        // packageids.push(packageidvalue);
        return packageidvalue;
    });
    // packages - not autopay and not unlimited
    console.log(`1234 here - membershipIds are: ${JSON.stringify(membershipIds)}`);
    console.log(`singleIds are: ${JSON.stringify(singleIds)}`);
    const packages = await models.studio_packages.findAll({
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
    console.log(`packagesIds are: ${JSON.stringify(packages)}`);
    console.log(`packages math - checking ids: ${JSON.stringify(packages)}`);
    const packageIds = await packages.map((packageid) => {
        const packageidvalue = packageid.dataValues.id;
        console.log(`packageidvalue is: ${packageidvalue}`);
        // packageids.push(packageidvalue);
        return packageidvalue;
    });
    const allpackagesremaining = await models.studio_packages.findAll({
        attributes: ['id', 'name', 'classAmount'],
        available: true,
        where: {
            dibs_studio_id: req.body.dibsStudioId,
            price: {
                [Op.gt]: 0
            }
        }
    });
    const leftovers = allpackagesremaining.filter((pack) => {
        console.log(`\n\nPACK CHECK TO SEE WHERE PACKS ARE INCLUDED: ${JSON.stringify(pack)}\n\n`);
        console.log(`should have id of: ${pack.dataValues.id}`);
        let includedalready = 0;
        if (singleIds.includes(pack.dataValues.id)) {
            console.log(`it is contained in singleids`);
            includedalready += 1;
            // return false;
        }
        if (membershipIds.includes(pack.dataValues.id)) {
            console.log(`it is contained in membershipIds`);
            includedalready += 1;
            // return false;
        }
        if (packageIds.includes(pack.dataValues.id)) {
            console.log(`it is contained in packageids`);
            includedalready += 1;
            // return false;
        }
        console.log(`includedAlready is: ${includedalready}`);
        if (includedalready >= 0) {
            return false;
        }
        console.log(`it is not contained anywhere`);
        console.log(`THROW BETTER ERROR HERE`);
        return true;
    });
    console.log(`\n\n\n\nhere\nv2 - test - leftovers is: ${JSON.stringify(leftovers)}\n\n\n\n`);
    async function getRevenueForTimePeriod(fromDate, toDate) {
        // GET TOTAL REVENUE
        const totalRevenue = await models.dibs_transaction.findAll({
            attributes: [
                [sequelize.fn('sum', sequelize.col('amount')), 'sumAmount'],
                [sequelize.fn('sum', sequelize.col('studio_credits_spent')), 'credits_spent']
            ],
            where: {
                dibs_studio_id: req.body.dibsStudioId,
                status: 1,
                stripe_charge_id: {
                    [Op.ne]: null
                },
                stripe_refund_id: null,
                createdAt: {
                    [Op.gte]: fromDate,
                    [Op.lte]: toDate
                },
                void: false
            },
            paranoid: false
        });
        // console.log(`\n\n${fromDate} TO ${toDate}\ntotalrevenue to help w/ calculations is: ${JSON.stringify(totalRevenue)}`);
        // GET MEMBERSHIP REVENUE
        const membershiprevenue = await models.dibs_transaction.findAll({
            attributes: [
                [sequelize.fn('sum', sequelize.col('amount')), 'sumAmount'],
                [sequelize.fn('sum', sequelize.col('studio_credits_spent')), 'credits_spent']
            ],
            where: {
                dibs_studio_id: req.body.dibsStudioId,
                status: 1,
                stripe_charge_id: {
                    [Op.ne]: null
                },
                stripe_refund_id: null,
                createdAt: {
                    [Op.gte]: fromDate,
                    [Op.lte]: toDate
                },
                void: false,
                studio_package_id: {
                    [Op.in]: membershipIds
                }
            },
            paranoid: false
        });
        // console.log(`membershiprevenue is: ${JSON.stringify(membershiprevenue)}`);
        // GET PACKAGE REVENUE
        const packagerevenue = await models.dibs_transaction.findAll({
            attributes: [
                [sequelize.fn('sum', sequelize.col('amount')), 'sumAmount'],
                [sequelize.fn('sum', sequelize.col('studio_credits_spent')), 'credits_spent']
            ],
            where: {
                dibs_studio_id: req.body.dibsStudioId,
                status: 1,
                stripe_charge_id: {
                    [Op.ne]: null
                },
                stripe_refund_id: null,
                createdAt: {
                    [Op.gte]: fromDate,
                    [Op.lte]: toDate
                },
                void: false,
                studio_package_id: {
                    [Op.in]: packageIds
                }
            },
            paranoid: false
        });
        // console.log(`packagerevenue is: ${JSON.stringify(packagerevenue)}`);
        // GET SINGLE REVENUE
        const singlerevenue = await models.dibs_transaction.findAll({
            attributes: [
                [sequelize.fn('sum', sequelize.col('amount')), 'sumAmount'],
                [sequelize.fn('sum', sequelize.col('studio_credits_spent')), 'credits_spent']
            ],
            where: {
                dibs_studio_id: req.body.dibsStudioId,
                status: 1,
                stripe_charge_id: {
                    [Op.ne]: null
                },
                stripe_refund_id: null,
                createdAt: {
                    [Op.gte]: fromDate,
                    [Op.lte]: toDate
                },
                void: false,
                studio_package_id: {
                    [Op.in]: singleIds
                }
            },
            paranoid: false
        });
        // GET SINGLE REVENUE WITH NO PACKAGE
        const singleRevenueNoPack = await models.dibs_transaction.findAll({
            attributes: [
                [sequelize.fn('sum', sequelize.col('amount')), 'sumAmount'],
                [sequelize.fn('sum', sequelize.col('studio_credits_spent')), 'credits_spent']
            ],
            where: {
                dibs_studio_id: req.body.dibsStudioId,
                status: 1,
                stripe_charge_id: {
                    [Op.ne]: null
                },
                stripe_refund_id: null,
                createdAt: {
                    [Op.gte]: fromDate,
                    [Op.lte]: toDate
                },
                void: false,
                eventid: {
                    [Op.ne]: null
                },
                studio_package_id: null
            },
            paranoid: false
        });
        // console.log(`singleRevenueNoPack is: ${JSON.stringify(singleRevenueNoPack)}`);
        // GET RETAIL REVENUE
        const retailRevenue = await models.dibs_transaction.findAll({
            attributes: [
                [sequelize.fn('sum', sequelize.col('amount')), 'sumAmount'],
                [sequelize.fn('sum', sequelize.col('studio_credits_spent')), 'credits_spent']
            ],
            where: {
                dibs_studio_id: req.body.dibsStudioId,
                status: 1,
                stripe_charge_id: {
                    [Op.ne]: null
                },
                stripe_refund_id: null,
                createdAt: {
                    [Op.gte]: fromDate,
                    [Op.lte]: toDate
                },
                void: false,
                type: 'retail'
            },
            paranoid: false
        });
        // console.log(`retailRevenue is: ${JSON.stringify(retailRevenue)}`);
        // NEXT - PUT IT ALL TOGETHER
        const totalAmount = totalRevenue[0].dataValues.sumAmount;
        const tootalCreditsSpent = totalRevenue[0].dataValues.credits_spent;
        const totalValue = totalAmount - tootalCreditsSpent;
        // console.log(`\n\n\n\n\ncheck this info for this period: ${JSON.stringify(fromDate)} TO ${JSON.stringify(toDate)}`);
        // console.log(`\n\n######################################\ntotalRevenue is: ${totalValue}`);
        const membershipAmount = membershiprevenue[0].dataValues.sumAmount;
        const membershipcreditSpent = membershiprevenue[0].dataValues.credits_spent;
        const totalMembershipRevenue = membershipAmount - membershipcreditSpent;
        // console.log(`membershipRevenue is: ${totalMembershipRevenue}`);
        const packageAmount = packagerevenue[0].dataValues.sumAmount;
        const packageCreditsSpent = packagerevenue[0].dataValues.credits_spent;
        const totalPackageRevenue = packageAmount - packageCreditsSpent;
        // console.log(`totalPackageRevenue is: ${totalPackageRevenue}`);
        const singleAmount = singlerevenue[0].dataValues.sumAmount;
        const singleCreditsSpent = singlerevenue[0].dataValues.credits_spent;
        const totalSingleRevenue = singleAmount - singleCreditsSpent;
        const singleRevenueNoPackAmount = singleRevenueNoPack[0].dataValues.sumAmount;
        const singleRevenueNoPackCreditsSpent = singleRevenueNoPack[0].dataValues.credits_spent;
        const totalSingleRevenueNoPack = singleRevenueNoPackAmount - singleRevenueNoPackCreditsSpent;
        const singleAllTogether = totalSingleRevenue + totalSingleRevenueNoPack;
        // console.log(`singleAllTogether is: ${singleAllTogether}`);
        const retailAmount = retailRevenue[0].dataValues.sumAmount;
        const retailCreditsSpent = retailRevenue[0].dataValues.credits_spent;
        const totalRetailRevenue = retailAmount - retailCreditsSpent;
        // console.log(`totalRetailRevenue is: ${totalRetailRevenue}`);
        const revenueArray = {
            totalRevenue: totalValue,
            membershipRevenue: totalMembershipRevenue,
            packageRevenue: totalPackageRevenue,
            singleRevenue: singleAllTogether,
            retailRevenue: totalRetailRevenue
        };
        console.log(`\n\n\n\n\n\n\n\nfrom: ${fromDate} to: ${toDate}`);
        console.log(`YOU ARE NOW CHECKING MATH V4 -----> revenueArray is: ${JSON.stringify(revenueArray)}\n\n\n\n\n\n\n`);
        return { revenueArray };
    }
    // get total revenue data series
    // start with this period
    const dataseries = [];
    const thisperiod = moment().startOf(timeperiod);
    const nowtime = moment();
    const thisperiodrevenue = await getRevenueForTimePeriod(thisperiod, nowtime);
    console.log(`\n\n\n\n\n\n\n\n&&&&&&&&&\n\n\n\nthisperiodrevenue2 is: ${JSON.stringify(thisperiodrevenue)}\n\n\n`);
    dataseries.push(thisperiodrevenue);
    console.log(`dataseries before getting the rest of the data: ${JSON.stringify(dataseries)}\n\n\n`);
    async function getSeriesData() {
        // const dataseries = [];
        for (let i = 1; i < 12; i += 1) {
            // Good: all asynchronous operations are immediately started.
            const period = moment(thisperiod).subtract(i, timeperiod);
            const endofperiod = moment(period).endOf(timeperiod);
            const revenueforperiod = getRevenueForTimePeriod(period, endofperiod);
            console.log(`\n\n\n\n\n\n\n\n\n\n\n#######################`);
            console.log(`YOU ARE HERE AGAIN\nFROM ${period} TO ${endofperiod}`);
            console.log(`revenueArrayForThisPeriod is: ${JSON.stringify(revenueforperiod)}\n\n\n\n\n`);
            dataseries.splice(i, 0, revenueforperiod);
        }
        // Now that all the asynchronous operations are running, here we wait until they all complete.
        return Promise.all(dataseries);
    }
    const contdataseries = await getSeriesData();
    contdataseries.reverse();
    // console.log(`contdataseries is: ${JSON.stringify(contdataseries)}`);
    // dataseries.push(contdataseries);
    // console.log(`\n\n\nfinal data series to return is: ${JSON.stringify(dataseries)}\n\n\n`);
    // for (let i = 1; i < 12; i += 1) {
    //     const period = moment(thisperiod).subtract(i, timeperiod);
    //     const endofperiod = moment(period).endOf(timeperiod);
    //     const revenueforperiod = getRevenueForTimePeriod(period, endofperiod);
    //     console.log(`revenueforperiod is: ${JSON.stringify(revenueforperiod)}`);
    //     console.log(`\n\n\n\n\n\n\ndataseries is: ${JSON.stringify(dataseries)}\n\n\n`);
    //     dataseries[0].data[i] = revenueforperiod;
    //     console.log(`dataseries is: ${JSON.stringify(dataseries)}`);
    // }
    res.json({
        msg: 'success',
        data: contdataseries
    });
}

module.exports = getDashboardSalesGrowthData;
