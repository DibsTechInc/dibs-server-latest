const { Op } = require('sequelize');
const moment = require('moment-timezone');

/**
 * @param {Object} user instance
 * @returns {Array<Object>} flash_credit instances
 */
module.exports = async function getFlashCredits({ userid, dibsStudioId }) {
    const flashCredits = await models.flash_credit.findAll({
        where: {
            createdAt: { [Op.gte]: moment().subtract(3, 'y') },
            userid,
            dibs_studio_id: dibsStudioId
        },
        limit: 100,
        paranoid: false,
        order: [['createdAt', 'desc']],
        include: [
            {
                model: models.dibs_studio,
                as: 'studio',
                attributes: ['currency', 'country']
            },
            {
                model: models.dibs_transaction,
                as: 'transaction',
                attributes: ['createdAt'],
                include: [
                    {
                        model: models.event,
                        as: 'event',
                        attributes: ['name', 'start_date']
                    }
                ]
            }
        ]
    });
    return flashCredits.map((fc) => ({ ...fc.dataValues }));
};
