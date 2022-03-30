'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_users', 'default_currency', Sequelize.STRING(3));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropColumn('dibs_users', 'default_currency');
  }
};
