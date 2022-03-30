'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('dibs_transactions', 'credit_tier_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'credit_tiers',
        key: 'id',
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('dibs_transactions', 'credit_tier_id');
  }
};
