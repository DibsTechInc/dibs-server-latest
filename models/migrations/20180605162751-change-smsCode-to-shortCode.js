'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('password_resets', 'shortCode', {
      type: Sequelize.INTEGER,
    });
    await queryInterface.sequelize.query('UPDATE password_resets SET "shortCode" = "smsCode"')
    return queryInterface.removeColumn('password_resets', 'smsCode');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('password_resets', 'smsCode', {
      type: Sequelize.INTEGER,
    });
    await queryInterface.sequelize.query('UPDATE password_resets SET "smsCode" = "shortCode"')
    return queryInterface.removeColumn('password_resets', 'shortCode');
  }
};
