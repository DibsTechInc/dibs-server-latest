'use strict';

module.exports = {
  up: async function (queryInterface, Sequelize) {
    await queryInterface.removeColumn('dibs_transactions', 'packageid');
    return await queryInterface.addColumn('dibs_transactions', 'for_passid', {
      type: Sequelize.INTEGER,
      references: {
        model: 'passes',
        key: 'id',
      },
    });
  },

  down: async function (queryInterface, Sequelize) {
    await queryInterface.removeColumn('dibs_transactions', 'for_passid');
    return await queryInterface.addColumn('dibs_transactions', 'packageid', {
      references: {
        model: 'studio_packages',
        key: 'id',
      },
      type: Sequelize.INTEGER,
    });
  }
};
