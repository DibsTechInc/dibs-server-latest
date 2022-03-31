'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'passes',
    'expiration_set_by_transaction',
    {
      type: Sequelize.INTEGER,
      references: {
        model: 'dibs_transactions',
        key: 'id',
      },
    }
  ),

  down: queryInterface => queryInterface.removeColumn('passes', 'expiration_set_by_transaction'),
};
