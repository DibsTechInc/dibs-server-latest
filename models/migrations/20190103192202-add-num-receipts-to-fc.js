'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('flash_credits', 'num_receipts', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('flash_credits', 'num_receipts');
  }
};
