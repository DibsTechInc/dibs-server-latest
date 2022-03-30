'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('dibs_portal_users', 'stripe_card_id', { type: Sequelize.STRING });
    return queryInterface.addColumn('dibs_portal_users', 'stripe_customer_id', { type: Sequelize.STRING });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('dibs_portal_users', 'stripe_card_id');
    return queryInterface.removeColumn('dibs_portal_users', 'stripe_customer_id');
  },
};
