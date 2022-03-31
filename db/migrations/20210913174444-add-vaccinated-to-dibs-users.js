'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('dibs_users', 'proof_of_vax', {
          type: Sequelize.DataTypes.BOOLEAN,
        }, { transaction: t }),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('dibs_users', 'proof_of_vax', { transaction: t }),
      ]);
    });
  }
};