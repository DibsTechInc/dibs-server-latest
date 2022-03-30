'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('credit_transactions', 'promoid', {
      type: Sequelize.INTEGER,
      references: {
        model: 'promo_codes',
        key: 'id',
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('credit_transactions', 'promoid');
  }
};
