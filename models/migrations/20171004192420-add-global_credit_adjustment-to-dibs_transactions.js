'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_transactions', 'global_credit_adjustment', {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_transactions', 'global_credit_adjustment');
  }
};
