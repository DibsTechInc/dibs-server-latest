'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('dibs_studio_instructors', 'rev_share_perc', {
          type: Sequelize.DataTypes.FLOAT
        }, { transaction: t }),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('dibs_studio_instructors', 'rev_share_perc', { transaction: t }),
      ]);
    });
  }
}; 
