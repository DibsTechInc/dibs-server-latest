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
        const assignIdsForPackages = async () => {
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
        const singleids = await assignIdsForSingles();
        const regularpackids = await assignIdsForPackages();
        console.log(`\n\n\n\nmembershipids - ${JSON.stringify(membershipids)}`);
        console.log(`singleids - ${JSON.stringify(singleids)}`);
        console.log(`package ids is: ${JSON.stringify(regularpackids)}\n\n\n\n`);
        res.json({
            msg: 'success',
            membershipids
        });
    } catch (err) {
        console.log(`error in getDashboardSalesGrowthData api call: ${err}`);
        return err;
    }
}

module.exports = getDashboardSalesGrowthData;
