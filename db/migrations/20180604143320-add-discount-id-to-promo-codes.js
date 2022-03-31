'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('promo_codes', 'stripe_coupon_id', Sequelize.STRING)
    return queryInterface.addConstraint('promo_codes', ['dibs_studio_id', 'stripe_coupon_id'], { type: 'UNIQUE' });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('promo_codes', 'stripe_coupon_id')
    return queryInterface.sequelize.query('ALTER TABLE promo_codes DROP CONSTRAINT IF EXISTS promo_codes_dibs_studio_id_stripe_coupon_id_uk;');
  }
};
