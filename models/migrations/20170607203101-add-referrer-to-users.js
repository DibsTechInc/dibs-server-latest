'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_users', 'referredBy', Sequelize.STRING)
      .then(() => queryInterface.addColumn('dibs_users', 'referredByDetails', Sequelize.STRING));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_users', 'referredBy')
      .then(() => queryInterface.removeColumn('dibs_users', 'referredByDetails'));
  }
};
