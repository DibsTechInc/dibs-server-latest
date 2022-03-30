'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('dibs_users', 'email', {type: Sequelize.STRING, unique: true})
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn('dibs_users', 'email', {type: Sequelize.STRING, unique: false})
  }
};
