'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('passes', 'canceledAt', Sequelize.DATE)
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('passes', 'canceledAt')

  }
};
