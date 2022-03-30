'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('credit_promo_codes', 'amount_application_type', {
      type: Sequelize.ENUM('fixed amount', 'percent'),
      defaultValue: 'fixed amount',
    })
    .then(() => queryInterface.addColumn('credit_promo_codes', 'max_amount', {
      type: Sequelize.INTEGER,
    }));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('credit_promo_codes', 'amount_application_type')
      .then(() => queryInterface.removeColumn('credit_promo_codes', 'max_amount'));
  },
};
