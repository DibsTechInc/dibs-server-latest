'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('passes', 'purchase_transaction_id');
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('passes', 'purchase_transaction_id', {
      references: {
        model: 'dibs_transactions',
        key: 'id',
      },
      type: Sequelize.INTEGER,
    });
  }
};
