'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addIndex('dibs_transactions', ['stripe_charge_id']);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('dibs_transactions', ['stripe_charge_id']);
  }
};
