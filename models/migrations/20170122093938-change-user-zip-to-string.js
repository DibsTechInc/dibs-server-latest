'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('dibs_users', 'zip', Sequelize.STRING);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('dibs_users', 'zip', Sequelize.INTEGER);
  }
};
