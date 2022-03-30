'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
  return queryInterface.addIndex('pricing_history', ['eventid', 'currentPrice', 'spots_booked']);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('pricing_history', ['eventid', 'currentPrice', 'spots_booked']);
  }
};
