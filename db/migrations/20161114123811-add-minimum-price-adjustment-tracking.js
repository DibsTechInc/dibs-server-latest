'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_transactions', 'min_charge_adj', Sequelize.FLOAT)
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.remove('dibs_transactions', 'min_charge_adj')

  }
};
