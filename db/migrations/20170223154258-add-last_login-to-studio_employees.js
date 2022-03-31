'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('studio_employees', 'last_login', {
      type: Sequelize.DATE,
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('studio_employees', 'last_login');
  }
};
