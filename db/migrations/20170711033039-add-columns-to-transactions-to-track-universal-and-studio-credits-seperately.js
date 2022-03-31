'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('dibs_transactions', 'credits_spent', 'studio_credits_spent')
    .then(() => queryInterface.addColumn('dibs_transactions', 'global_credits_spent', Sequelize.FLOAT));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('dibs_transactions', 'studio_credits_spent', 'credits_spent')
    .then(() => queryInterface.removeColumn('dibs_transactions', 'global_credits_spent'));
  }
};
