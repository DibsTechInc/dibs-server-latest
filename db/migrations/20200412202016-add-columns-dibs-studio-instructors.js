'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('dibs_studio_instructors', 'rate_per_class', {
          type: Sequelize.DataTypes.FLOAT
        }, { transaction: t }),
        queryInterface.addColumn('dibs_studio_instructors', 'rate_per_head', {
          type: Sequelize.DataTypes.FLOAT,
        }, { transaction: t }),
        queryInterface.addColumn('dibs_studio_instructors', 'hurdle', {
          type: Sequelize.DataTypes.INTEGER,
        }, { transaction: t }),
        queryInterface.addColumn('dibs_studio_instructors', 'bonus_flat', {
          type: Sequelize.DataTypes.FLOAT,
        }, { transaction: t }),
        queryInterface.addColumn('dibs_studio_instructors', 'bonus_per_head', {
          type: Sequelize.DataTypes.FLOAT,
        }, { transaction: t }),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('dibs_studio_instructors', 'rate_per_class', { transaction: t }),
        queryInterface.removeColumn('dibs_studio_instructors', 'rate_per_head', { transaction: t }),
        queryInterface.removeColumn('dibs_studio_instructors', 'hurdle', { transaction: t }),
        queryInterface.removeColumn('dibs_studio_instructors', 'bonus_flat', { transaction: t }),
        queryInterface.removeColumn('dibs_studio_instructors', 'bonus_per_head', { transaction: t }),
      ]);
    });
  }
}; 
