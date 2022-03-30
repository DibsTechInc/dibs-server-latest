'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('dibs_transactions', 'amount_charged', {
      type: Sequelize.FLOAT,
      defaultValue: 0,
      allowNull: false,
    });
    return queryInterface.addColumn('dibs_transactions', 'amount_refunded', {
      type: Sequelize.FLOAT,
      defaultValue: 0,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('dibs_transactions', 'amount_charged', {
      type: Sequelize.FLOAT,
      defaultValue: 0,
      allowNull: false,
    });
    return queryInterface.removeColumn('dibs_transactions', 'amount_refunded', {
      type: Sequelize.FLOAT,
      defaultValue: 0,
      allowNull: false,
    });
  },
};
