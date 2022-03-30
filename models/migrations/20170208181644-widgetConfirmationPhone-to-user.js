'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_users', 'widgetConfirmationPhone', { type: Sequelize.BOOLEAN })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_users', 'widgetConfirmationPhone')
  }
};
