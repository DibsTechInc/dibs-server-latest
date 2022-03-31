'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('removal_requests', 'employee_name', 'employeeName')
    .then(() => queryInterface.renameColumn('removal_requests', 'employee_email', 'employeeEmail'));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('removal_requests', 'employeeName', 'employee_name')
    .then(() => queryInterface.renameColumn('removal_requests', 'employeeEmail', 'employee_email'));
  }
};
