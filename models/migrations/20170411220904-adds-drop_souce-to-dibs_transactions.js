'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_transactions', 'drop_source', Sequelize.STRING(6))
    .then(() => queryInterface.sequelize.query(
      'UPDATE dibs_transactions SET drop_source = \'admin\' WHERE early_cancel IS NOT NULL;'
    ));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_transactions', 'drop_source');
  }
};
