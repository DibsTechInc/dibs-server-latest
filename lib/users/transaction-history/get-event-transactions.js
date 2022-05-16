const { Op } = require('sequelize');
const moment = require('moment-timezone');

/**
 * @param {boolean} dropped true if querying dropped classes
 * @param {boolean} upcoming true if querying upcoming classes
 * @returns {Object} where condition for event start date
 */
function getStartDateCondition({ dropped, upcoming }) {
    if (dropped) return { [Op.not]: null };
    const compare = upcoming ? '>' : '<=';
    return sequelize.literal(
        `("event"."start_date"::TIMESTAMP WITH TIME ZONE AT TIME ZONE 'UTC')::TIMESTAMP AT TIME ZONE "dibs_studio"."mainTZ" ${compare} NOW()`
    );
}

module.exports = async function getEvents({ userid, dibsStudioId, upcoming = false, dropped = false, passid = null }) {
    const commonWhereConditions = {
        userid,
        dibs_studio_id: dibsStudioId,
        type: models.dibs_transaction.Types.CLASS,
        void: false,
        status: 1
    };
    const transactionQueryWhere = passid
        ? {
              ...commonWhereConditions,
              with_passid: passid
          }
        : {
              ...commonWhereConditions,
              createdAt: { [Op.gte]: moment().subtract(3, 'y') },
              early_cancel: { [dropped ? Op.not : Op.is]: null }
          };
    const transactions = await models.dibs_transaction.findAll({
        where: transactionQueryWhere,
        attributes: [
            'id',
            'eventid',
            'createdAt',
            'deletedAt',
            'amount',
            'studio_credits_spent',
            'raf_credits_spent',
            'global_credits_spent',
            'discount_amount',
            'tax_amount',
            'original_price',
            'early_cancel',
            'smart_pass_awarded',
            'unpaid'
        ],
        order: [[sequelize.literal('"event".start_date'), 'desc']],
        limit: 100,
        paranoid: false,
        include: [
            {
                model: models.dibs_studio,
                as: 'dibs_studio',
                attributes: ['currency', 'country', 'mainTZ', 'cancel_time'],
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
                where: {
                    start_date: passid ? { [Op.not]: null } : getStartDateCondition({ dropped, upcoming })
                },
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
                as: 'pass',
                paranoid: false,
                include: [
                    {
                        model: models.studio_packages,
                        as: 'studioPackage',
                        attributes: ['name']
                    }
                ]
            },
            {
                model: models.flash_credit,
                as: 'flashCredit',
                attributes: ['credit'],
                paranoid: false
            }
        ]
    });
    return transactions.map((transaction) => ({
        ...transaction.dataValues,
        chargeAmount: transaction.chargeAmount
    }));
};
