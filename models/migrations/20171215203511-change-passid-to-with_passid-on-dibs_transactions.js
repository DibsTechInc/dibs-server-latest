'use strict';

module.exports = {
  up: async function (queryInterface, Sequelize) {
    await queryInterface.removeColumn('dibs_transactions', 'passid');
    return await queryInterface.addColumn('dibs_transactions', 'with_passid', {
      type: Sequelize.INTEGER,
      references: {
        model: 'passes',
        key: 'id',
      },
    });
  },

  down: async function (queryInterface, Sequelize) {
    await queryInterface.removeColumn('dibs_transactions', 'with_passid');
    return await queryInterface.addColumn('dibs_transactions', 'passid', {
      type: Sequelize.INTEGER,
      references: {
        model: 'passes',
        key: 'id',
      },
    });
  }
};
