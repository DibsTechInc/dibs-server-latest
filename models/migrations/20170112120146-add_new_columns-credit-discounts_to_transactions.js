'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_transactions', 'discount_amount', {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    }).then(() => (
      queryInterface.addColumn('dibs_transactions', 'early_cancel', Sequelize.BOOLEAN)
    ));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_transactions', 'discount_amount')
    .then(() => queryInterface.removeColumn('dibs_transactions', 'early_cancel'));
  }
};
