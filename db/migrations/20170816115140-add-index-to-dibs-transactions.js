'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addIndex('dibs_transactions', ['status', 'early_cancel', 'void']);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('dibs_transactions', ['status', 'early_cancel', 'void']);
  }
};
