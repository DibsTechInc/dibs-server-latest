'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('on_demand_events', 'trainerid', {
          type: Sequelize.DataTypes.INTEGER,
        }, { transaction: t }),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('on_demand_events', 'trainerid', { transaction: t }),
      ]);
    });
  }
};