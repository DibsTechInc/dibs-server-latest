'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('dibs_studios', 'stripeid', {
          type: Sequelize.DataTypes.STRING,
        }, { transaction: t }),
        queryInterface.addColumn('dibs_studios', 'stripe_cardid', {
          type: Sequelize.DataTypes.STRING,
        }, { transaction: t }),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('dibs_studios', 'stripeid', { transaction: t }),
        queryInterface.removeColumn('dibs_studios', 'stripe_cardid', { transaction: t }),
      ]);
    });
  }
}; 
