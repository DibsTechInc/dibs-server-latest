'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('pricing_history', 'spots_booked', {
      type: Sequelize.INTEGER,
    })
    .then(() => queryInterface.addColumn('pricing_history', 'seats', {
      type: Sequelize.INTEGER,
    }));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('pricing_history', 'spots_booked')
    .then(() => queryInterface.removeColumn('pricing_history', 'seats'));
  }
};
