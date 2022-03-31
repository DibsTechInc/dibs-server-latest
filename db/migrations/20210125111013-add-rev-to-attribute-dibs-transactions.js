'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('dibs_transactions', 'rev_to_attribute', {
          type: Sequelize.DataTypes.FLOAT,
        }, { transaction: t }),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('dibs_transactions', 'rev_to_attribute', { transaction: t }),
      ]);
    });
  }
};