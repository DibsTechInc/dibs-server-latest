'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('password_resets', 'smsCode', {
      type: Sequelize.INTEGER,
    });
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('password_resets', 'smsCode');
  }
};
