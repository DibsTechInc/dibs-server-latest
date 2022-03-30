'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('get_dibs_requests', 'bookingUsername')
    .then(() => queryInterface.removeColumn('get_dibs_requests', 'bookingPassword'))
    .then(() => queryInterface.removeColumn('get_dibs_requests', 'routingNumber'))
    .then(() => queryInterface.removeColumn('get_dibs_requests', 'accountNumber'))
    .then(() => queryInterface.addColumn('get_dibs_requests', 'studioid', Sequelize.INTEGER))


  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('get_dibs_requests', 'bookingUsername', Sequelize.STRING)
    .then(() => queryInterface.addColumn('get_dibs_requests', 'bookingPassword', Sequelize.STRING))
    .then(() => queryInterface.addColumn('get_dibs_requests', 'routingNumber', Sequelize.INTEGER))
    .then(() => queryInterface.addColumn('get_dibs_requests', 'accountNumber', Sequelize.INTEGER))
    .then(() => queryInterface.removeColumn('get_dibs_requests', 'studioid'))

  }
};
