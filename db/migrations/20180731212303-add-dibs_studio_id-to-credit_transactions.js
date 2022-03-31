'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('credit_transactions', 'dibs_studio_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'dibs_studios',
        key: 'id',
      },
    });
    return queryInterface.sequelize.query(
      'UPDATE credit_transactions SET dibs_studio_id = (SELECT dibs_studio_id FROM dibs_transactions WHERE dibs_transactions.id = credit_transactions.transaction_id)')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('credit_transactions', 'dibs_studio_id');
  }
};
