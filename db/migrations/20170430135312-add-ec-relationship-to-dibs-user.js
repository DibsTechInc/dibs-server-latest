'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.addColumn('dibs_users', 'emergencycontactrelationship', Sequelize.STRING);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_users', 'emergencycontactrelationship');
  }
};
