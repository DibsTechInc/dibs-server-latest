'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.addIndex('dibs_transactions', ['for_passid']).then(() => queryInterface.addIndex('dibs_transactions', ['for_passid', 'deletedAt']));
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.removeIndex('dibs_transactions', ['for_passid', 'deletedAt']).then(() => queryInterface.removeIndex('dibs_transactions', ['for_passid']));
  }
};
