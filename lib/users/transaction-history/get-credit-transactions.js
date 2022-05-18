const { Op } = require('sequelize');
const moment = require('moment-timezone');

module.exports = async function getCreditTransactions({ userid, dibsStudioId }) {
    const creditTransactions = await models.credit_transaction.findAll({
        where: {
            createdAt: {
                [Op.gte]: moment(Math.max(moment('2018-08-01T00:00:00Z'), moment().subtract(5, 'y'))) // 2018-08-01 is when we can guarantee we track reason for credit transactions
            },
            userid,
            dibs_studio_id: dibsStudioId
        },
        limit: 300,
        order: [['createdAt', 'desc']],
        include: [
            {
                model: models.dibs_studio,
                as: 'studio',
                attributes: ['currency', 'country']
            },
            {
                model: models.dibs_transaction,
                attributes: [
                    'id',
                    'createdAt',
                    'deletedAt',
                    'type',
                    'description',
                    'amount',
                    'studio_credits_spent',
                    'raf_credits_spent',
                    'global_credits_spent',
                    'discount_amount',
                    'tax_amount',
                    'original_price'
                ],
                as: 'transaction',
                paranoid: false,
                required: false,
                where: {
                    status: 1,
                    void: false
                },
                include: [
                    {
                        model: models.dibs_studio,
                        as: 'dibs_studio',
                        attributes: ['currency', 'country'],
                        include: [
                            {
                                model: models.dibs_config,
                                as: 'dibs_config',
                                attributes: ['customTimeFormat']
                            }
                        ]
                    },
                    {
                        model: models.event,
                        as: 'event',
                        attributes: ['name', 'start_date'],
                        include: [
                            {
                                model: models.dibs_studio_instructors,
                                as: 'instructor',
                                attributes: ['firstname', 'lastname']
                            },
                            {
                                model: models.dibs_studio_locations,
                                as: 'location',
                                attributes: ['name']
                            }
                        ]
                    },
                    {
                        model: models.passes,
                        as: 'passPurchased',
                        include: [
                            {
                                model: models.studio_packages,
                                as: 'studioPackage'
                            }
                        ]
                    },
                    {
                        model: models.passes,
                        as: 'pass',
                        include: [
                            {
                                model: models.studio_packages,
                                as: 'studioPackage'
                            }
                        ]
                    },
                    {
                        model: models.retail_product,
                        as: 'retail'
                    }
                ]
            }
        ]
    });
    return creditTransactions;
};
