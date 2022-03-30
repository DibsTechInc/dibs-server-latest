'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('on_demand_events', 'equipment', {
          type: Sequelize.DataTypes.STRING,
        }, { transaction: t }),
        queryInterface.addColumn('on_demand_events', 'dateRecorded', {
          type: Sequelize.DataTypes.DATE,
        }, { transaction: t }),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('on_demand_events', 'equipment', { transaction: t }),
        queryInterface.removeColumn('on_demand_events', 'dateRecorded', { transaction: t }),
      ]);
    });
  }
};