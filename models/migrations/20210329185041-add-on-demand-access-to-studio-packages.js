'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('studio_packages', 'on_demand_access', {
          type: Sequelize.DataTypes.FLOAT,
        }, { transaction: t }),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('studio_packages', 'on_demand_access', { transaction: t }),
      ]);
    });
  }
};