'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('email_verifications', 'deletedAt', Sequelize.DATE);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('email_verification', 'deletedAt');
  }
};
