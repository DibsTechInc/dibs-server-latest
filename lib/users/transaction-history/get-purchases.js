const { Op, Sequelize } = require('sequelize');
const moment = require('moment-timezone');
const models = require('@dibs-tech/models');

/**
 * @param {Object} user instance
 * @returns {Array<Object>} dibs_transaction instances
 */
module.exports = async function getPurchases({ user, dibsStudioId }) {
    const transactions = await models.dibs_transaction.findAll({
        where: {
            createdAt: { [Op.gte]: moment().subtract(5, 'y') },
            userid: 2502,
            dibs_studio_id: dibsStudioId,
            status: 1,
            void: false,
            [Op.or]: [
                {
                    type: {
                        [Op.notIn]: [
                            models.dibs_transaction.Types.WAITLIST,
                            models.dibs_transaction.Types.COMP_CREDIT,
                            models.dibs_transaction.Types.REFER_A_FRIEND_CREDIT
                        ]
                    }
                },
                {
                    [Op.and]: [
                        { type: models.dibs_transaction.Types.WAITLIST },
                        Sequelize.literal(
                            '("event"."start_date"::TIMESTAMP WITH TIME ZONE AT TIME ZONE \'UTC\')::TIMESTAMP WITH TIME ZONE AT TIME ZONE "dibs_studio"."mainTZ" > NOW()'
                        )
                    ]
                }
            ]
        },
        attributes: [
            'id',
            'createdAt',
            'deletedAt',
            'type',
            'amount',
            'studio_credits_spent',
            'raf_credits_spent',
            'global_credits_spent',
            'stripe_charge_id',
            'stripe_refund_id',
            'promoid',
            'original_price',
            'discount_amount',
            'tax_amount',
            'unpaid',
            'smart_pass_awarded'
        ],
        limit: 1000,
        paranoid: false,
        order: [['createdAt', 'desc']],
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
                as: 'retail',
                paranoid: false
            },
            {
                model: models.flash_credit,
                as: 'flashCredit',
                attributes: ['credit'],
                paranoid: false
            }
        ]
    });
    return transactions.map((t) => ({
        ...t.dataValues,
        chargeAmount: t.chargeAmount
    }));
};
