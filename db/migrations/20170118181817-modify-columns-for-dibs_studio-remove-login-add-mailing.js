'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_studios', 'password')
    .then(() => queryInterface.removeColumn('dibs_studios', 'login'))
    .then(() => queryInterface.addColumn('dibs_studios', 'mailing_address', Sequelize.STRING))
    .then(() => queryInterface.addColumn('dibs_studios', 'city', Sequelize.STRING))
    .then(() => queryInterface.addColumn('dibs_studios', 'state', Sequelize.STRING))
    .then(() =>  queryInterface.addColumn('dibs_studios', 'zip', Sequelize.STRING))
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_studios', 'password', Sequelize.STRING)
    .then(() => queryInterface.addColumn('dibs_studios', 'login', Sequelize.STRING))
    .then(() => queryInterface.removeColumn('dibs_studios', 'mailing_address'))
    .then(() => queryInterface.removeColumn('dibs_studios', 'city'))
    .then(() => queryInterface.removeColumn('dibs_studios', 'state'))
    .then(() => queryInterface.removeColumn('dibs_studios', 'zip'))
  }
};
