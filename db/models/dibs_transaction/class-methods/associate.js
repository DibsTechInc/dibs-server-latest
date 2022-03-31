module.exports = function associate(models) {
  models.dibs_transaction.belongsTo(models.event, { foreignKey: 'eventid', targetKey: 'eventid', as: 'event' });
  models.dibs_transaction.belongsTo(models.dibs_user, { foreignKey: 'userid', as: 'user' });
  models.dibs_transaction.belongsTo(models.dibs_studio, { foreignKey: 'dibs_studio_id', as: 'dibs_studio' });
  models.dibs_transaction.belongsTo(models.flash_credit, { foreignKey: 'flash_credit_id', as: 'flashCredit' });
  models.dibs_transaction.belongsTo(models.promo_code, { foreignKey: 'promoid', as: 'promo_code' });
  models.dibs_transaction.belongsTo(models.stripe_payouts, { foreignKey: 'stripePayoutId', as: 'payout' });
  models.dibs_transaction.belongsTo(models.passes, { foreignKey: 'with_passid', as: 'pass' });
  models.dibs_transaction.belongsTo(models.passes, { foreignKey: 'for_passid', as: 'passPurchased' });
  models.dibs_transaction.belongsTo(models.dibs_gift_card, { foreignKey: 'gift_card_id', as: 'giftCard', constraints: false });
  models.dibs_transaction.belongsTo(models.studio_packages, { foreignKey: 'studio_package_id', as: 'package' });
  models.dibs_transaction.belongsTo(models.retail_product, { foreignKey: 'retail_product_id', as: 'retail' });
  models.dibs_transaction.belongsTo(models.spot, { foreignKey: 'spot_id', as: 'spot' });
  models.dibs_transaction.belongsTo(models.credit_tier, { foreignKey: 'credit_tier_id', as: 'creditTier' });
};
