'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('pricing_history', 'manual_pricing_id', {
      type: Sequelize.INTEGER,
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('pricing_history', 'manual_pricing_id');
  }
};
