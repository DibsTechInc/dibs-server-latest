'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_transactions', 'dibs_fee', Sequelize.FLOAT)
    .then(() => queryInterface.addColumn('dibs_transactions', 'stripe_fee', Sequelize.FLOAT))
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_transactions', 'dibs_fee')
    .then(() => queryInterface.removeColumn('dibs_transactions', 'stripe_fee'))
  }
};
