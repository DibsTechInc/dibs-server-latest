'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('promo_codes', 'locations', Sequelize.ARRAY(Sequelize.INTEGER));

  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('promo_codes', 'locations')
  }
};
