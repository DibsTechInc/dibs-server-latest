'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_transactions', 'studio_payment', {
      type: Sequelize.FLOAT,
    })
    .then(() => queryInterface.addColumn('dibs_transactions', 'tax_withheld', {
      type: Sequelize.FLOAT,
    }));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_transactions', 'studio_payment')
      .then(() => queryInterface.removeColumn('dibs_transactions', 'tax_withheld'));
  }
};
