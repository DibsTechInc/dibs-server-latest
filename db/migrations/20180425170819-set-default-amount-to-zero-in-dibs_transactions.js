'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('UPDATE dibs_transactions SET amount = 0 WHERE amount IS NULL');
    return queryInterface.changeColumn('dibs_transactions', 'amount', {
      type: Sequelize.FLOAT,
      defaultValue: 0,
      allowNull: false,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('dibs_transactions', 'amount', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
  }
};
