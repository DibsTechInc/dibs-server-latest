'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('dibs_studios', 'subscription_fee', {
          type: Sequelize.DataTypes.FLOAT,
        }, { transaction: t }),
        queryInterface.addColumn('dibs_studios', 'total_monthly_charge', {
          type: Sequelize.DataTypes.FLOAT,
        }, { transaction: t }),
        queryInterface.addColumn('dibs_studios', 'date_of_charge', {
          type: Sequelize.DataTypes.INTEGER,
        }, { transaction: t }),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('dibs_studios', 'subscription_fee', { transaction: t }),
        queryInterface.removeColumn('dibs_studios', 'total_monthly_charge', { transaction: t }),
        queryInterface.removeColumn('dibs_studios', 'date_of_charge', { transaction: t }),
      ]);
    });
  }
}; 