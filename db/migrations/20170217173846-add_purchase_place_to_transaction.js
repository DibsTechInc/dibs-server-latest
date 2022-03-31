'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_transactions', 'purchasePlace', Sequelize.STRING(12));
  },

  down: function (queryInterface, Sequelize) {
  return queryInterface.removeColumn('dibs_transactions', 'purchasePlace')
  }
};
