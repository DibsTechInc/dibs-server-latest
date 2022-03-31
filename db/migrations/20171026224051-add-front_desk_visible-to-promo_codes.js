'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('promo_codes', 'front_desk_visible', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('promo_codes', 'front_desk_visible');
  }
};
