'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('credit_transactions', 'credit_tier_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'credit_tiers',
        key: 'id',
      },
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('credit_transactions', 'credit_tier_id');
  }
};
