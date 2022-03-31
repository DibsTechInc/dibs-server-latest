'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('dibs_transactions', 'swipe_fees_to_attribute', {
          type: Sequelize.DataTypes.FLOAT,
        }, { transaction: t }),
        queryInterface.addColumn('dibs_transactions', 'tax_to_attribute', {
          type: Sequelize.DataTypes.FLOAT,
        }, { transaction: t }),
        queryInterface.addColumn('dibs_transactions', 'net_rev_to_attribute', {
          type: Sequelize.DataTypes.FLOAT,
        }, { transaction: t }),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('dibs_transactions', 'swipe_fees_to_attribute', { transaction: t }),
        queryInterface.removeColumn('dibs_transactions', 'tax_to_attribute', { transaction: t }),
        queryInterface.removeColumn('dibs_transactions', 'net_rev_to_attribute', { transaction: t }),
      ]);
    });
  }
};