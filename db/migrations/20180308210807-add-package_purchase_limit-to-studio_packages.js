'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('studio_packages', 'packagePurchaseLimit', {
      type: Sequelize.INTEGER,
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('studio_packages', 'packagePurchaseLimit');
  }
};
