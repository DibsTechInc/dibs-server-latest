'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('passes', 'used_transaction_id')
      .then(() => queryInterface.addColumn('passes', 'totalUses', {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        validate: { min: 0, max: Infinity }
      }))
      .then(() => queryInterface.addColumn('passes', 'usesCount', {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        validate: { min: 0, max: Infinity }
      }));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('passes', 'totalUses')
      .then(() => queryInterface.removeColumn('passes', 'totalUses'))
      .then(() => queryInterface.addColumn('passes', 'passes', 'used_transaction_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'dibs_transactions',
          key: 'id',
        },
      }));
  }
};
