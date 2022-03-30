'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('removal_requests', 'employee_name', {
      type: Sequelize.STRING,
    })
    .then(() => queryInterface.addColumn('removal_requests', 'employee_email', {
      type: Sequelize.STRING,
    }));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('removal_requests', 'employee_name')
    .then(() => queryInterface.removeColumn('removal_requests', 'employee_email'));
  }
};
