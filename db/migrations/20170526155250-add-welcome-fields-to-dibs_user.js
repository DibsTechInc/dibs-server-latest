'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_users', 'welcome_complete', Sequelize.BOOLEAN)
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_users', 'welcome_complete')
  }
};
