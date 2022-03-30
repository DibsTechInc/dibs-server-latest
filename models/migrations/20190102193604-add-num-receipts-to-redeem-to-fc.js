'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('flash_credits', 'num_receipts_to_redeem', {
      type: Sequelize.INTEGER,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('flash_credits', 'num_receipts_to_redeem');
  }
};
