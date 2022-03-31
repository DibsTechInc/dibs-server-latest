'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('dibs_user_studios', 'vax_recorded_date', {
          type: Sequelize.DataTypes.DATE,
        }, { transaction: t }),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('dibs_user_studios', 'vax_recorded_date', { transaction: t }),
      ]);
    });
  }
};