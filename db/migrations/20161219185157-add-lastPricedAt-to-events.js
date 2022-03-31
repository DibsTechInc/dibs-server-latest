'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('events', 'lastPricedAt', Sequelize.DATE)
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('events', 'lastPricedAt', Sequelize.DATE)
  }
};
