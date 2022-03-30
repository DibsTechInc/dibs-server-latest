'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('promo_codes', 'first_time_dibs', {
      defaultValue: false,
      type: Sequelize.BOOLEAN
    }).then(() => queryInterface.addColumn('promo_codes', 'first_time_studio_dibs', {
      defaultValue: false,
      type: Sequelize.BOOLEAN
    }))
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.remove('promo_codes', 'first_time_dibs')
    .then(() => queryInterface.remove('promo_codes', 'first_time_studio_dibs'))
  }
};
