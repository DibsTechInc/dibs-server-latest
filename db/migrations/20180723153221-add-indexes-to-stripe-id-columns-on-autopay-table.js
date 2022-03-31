'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('CREATE UNIQUE INDEX duas_stripe_subscription_id_idx ON dibs_user_autopay_packages USING BTREE (stripe_subscription_id);')
    return queryInterface.sequelize.query('CREATE INDEX duas_stripe_customer_id_idx ON dibs_user_autopay_packages USING GIN (stripe_customer_id gin_trgm_ops);');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('DROP INDEX duas_stripe_customer_id_idx CASCADE;')
    return queryInterface.sequelize.query('DROP INDEX duas_stripe_subscription_id_idx CASCADE;')
  }
};
