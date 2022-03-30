'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('dibs_transactions', 'checkoutUUID', Sequelize.UUID)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('dibs_transactions', 'checkoutUUID')
  }
};
