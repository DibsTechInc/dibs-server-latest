'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('zoom_notifications', 'dibs_studio_id', {
          type: Sequelize.DataTypes.INTEGER
        }, { transaction: t }),
        queryInterface.addColumn('zoom_notifications', 'createdAt', {
          type: Sequelize.DataTypes.DATE,
        }, { transaction: t }),
        queryInterface.addColumn('zoom_notifications', 'updatedAt', {
          type: Sequelize.DataTypes.DATE,
        }, { transaction: t }),
        queryInterface.addColumn('zoom_notifications', 'deletedAt', {
          type: Sequelize.DataTypes.DATE,
        }, { transaction: t }),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('zoom_notifications', 'dibs_stduio_id', { transaction: t }),
        queryInterface.removeColumn('zoom_notifications', 'createdAt', { transaction: t }),
        queryInterface.removeColumn('zoom_notifications', 'updatedAt', { transaction: t }),
        queryInterface.removeColumn('zoom_notifications', 'deletedAt', { transaction: t }),
      ]);
    });
  }
};