'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_transactions', 'stripePayoutId', Sequelize.STRING)
      .then(() => queryInterface.addColumn('dibs_transactions', 'stripePaymentId', Sequelize.STRING));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_transactions', 'stripePayoutId')
      .then(() =>  queryInterface.removeColumn('dibs_transactions', 'stripePaymentId'));
  }
};
