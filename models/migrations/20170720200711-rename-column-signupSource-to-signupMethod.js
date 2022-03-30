'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('dibs_users', 'signupSource', 'signupMethod');
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('dibs_users', 'signupMethod', 'signupSource');
  }
};
