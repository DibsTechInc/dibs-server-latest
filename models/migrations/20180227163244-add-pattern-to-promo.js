'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('promo_codes', 'class_name_pattern', Sequelize.STRING)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropColumn('promo_codes', 'class_name_pattern')
  }
};
