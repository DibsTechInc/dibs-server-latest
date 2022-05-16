const moment = require('moment');
const { Op } = require('sequelize');

/**
 * @param {Object} user instance
 * @returns {Array<Object>} dibs_transaction instances
 */
module.exports = async function getPacks({ user, dibsStudioId, available }) {
  let transactions = await models.dibs_transaction.findAll({
    where: {
      createdAt: { [Op.gte]: moment().subtract(3, 'y') },
      userid: user.id,
      dibs_studio_id: dibsStudioId,
      status: 1,
      void: false,
      type: models.dibs_transaction.Types.PACKAGE,
    },
    attributes: [
      'id',
      'createdAt',
      'deletedAt',
      'type',
      'amount',
      'original_price',
      'studio_credits_spent',
      'raf_credits_spent',
      'global_credits_spent',
      'discount_amount',
      'tax_amount',
      'stripe_refund_id',
    ],
    limit: 100,
    order: [['createdAt', 'desc']],
    include: [
      {
        model: models.dibs_studio,
        as: 'dibs_studio',
        attributes: [
          'currency',
          'country',
        ],
      },
      {
        model: models.passes,
        as: 'passPurchased',
        include: [{
          model: models.studio_packages,
          as: 'studioPackage',
          attributes: ['name', 'unlimited'],
        }],
      },
    ],
  });
  const availabilityCondition = x => (available ? x : !x);
  transactions = transactions.filter(
    t => availabilityCondition(
      !t.stripe_refund_id && t.passPurchased.isValid()));
  return transactions.map(t => ({
    ...t.dataValues,
    chargeAmount: t.chargeAmount,
  }));
};
