'use strict';

module.exports = {
  up: async function (queryInterface, Sequelize) {
    let migration = await queryInterface.addColumn('exceptions', 'to_date', { type: Sequelize.DATE });
    migration = await queryInterface.addColumn('exceptions', 'from_date', { type: Sequelize.DATE });
    return migration;
  },

  down: async function (queryInterface, Sequelize) {
    let migration = await queryInterface.removeColumn('exceptions', 'to_date');
    migration = await queryInterface.removeColumn('exceptions', 'from_date');
    return migration;
  }
};
