'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('events', 'copy_zoomlink_forward', {
          type: Sequelize.DataTypes.BOOLEAN,
        }, { transaction: t }),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('events', 'copy_zoomlink_forward', { transaction: t }),
      ]);
    });
  }
};