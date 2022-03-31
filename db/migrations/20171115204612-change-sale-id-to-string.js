'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('dibs_transactions', 'saleid', { type: Sequelize.STRING(30) })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('dibs_transactions', 'saleid', { type: Sequelize.INTEGER })
  }
};
