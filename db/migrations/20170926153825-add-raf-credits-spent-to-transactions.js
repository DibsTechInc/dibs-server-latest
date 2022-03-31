'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_transactions', 'raf_credits_spent', {
      type: Sequelize.FLOAT,
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_transactions', 'raf_credits_spent');
  }
};
