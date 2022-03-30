'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('passes', 'dibs_transaction_id')
    .then(() => queryInterface.addColumn('passes', 'used_transaction_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'dibs_transactions',
        key: 'id',
      },
    }))
    .then(() => queryInterface.addColumn('passes', 'purchase_transaction_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'dibs_transactions',
        key: 'id',
      },
    }));
  },


  down: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('passes', 'dibs_transaction_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'dibs_transactions',
        key: 'id',
      },
    })
    .then(() => queryInterface.removeColumn('passes', 'used_transaction_id'))
    .then(() => queryInterface.removeColumn('passes', 'purchase_transaction_id'))
  }
};
