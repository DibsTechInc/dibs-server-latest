'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('dibs_user_studios', 'showed_vax_proof', {
          type: Sequelize.DataTypes.BOOLEAN,
        }, { transaction: t }),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('dibs_user_studios', 'showed_vax_proof', { transaction: t }),
      ]);
    });
  }
};