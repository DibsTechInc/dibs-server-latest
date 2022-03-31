'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_transactions', 'studioid', Sequelize.INTEGER)
    .then(() => queryInterface.addColumn('dibs_transactions', 'source', Sequelize.STRING(4)))
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_transactions', 'studioid')
    .then(() => queryInterface.removeColumn('dibs_transactions', 'source'))
  }
};
