'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('dibs_recurring_events', 'is_recurring', {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: false,
        }, { transaction: t }),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('dibs_recurring_events', 'is_recurring', { transaction: t }),
      ]);
    });
  }
};