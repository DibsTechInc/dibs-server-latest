'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('studio_packages', 'on_demand_access', { type: Sequelize.FLOAT });
    return queryInterface.addColumn('studio_packages', 'on_demand_access', { type: Sequelize.BOOLEAN });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('studio_packages', 'on_demand_access', { type: Sequelize.BOOLEAN });
    return queryInterface.addColumn('studio_packages', 'on_demand_access', { type: Sequelize.FLOAT });
  },
};