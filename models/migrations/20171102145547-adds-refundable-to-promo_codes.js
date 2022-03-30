'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('promo_codes', 'refundable', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('promo_codes', 'refundable');
  }
};
