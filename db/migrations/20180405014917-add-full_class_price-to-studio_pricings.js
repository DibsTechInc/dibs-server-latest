'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'studio_pricings',
    'full_class_price',
    { type: Sequelize.INTEGER },
  ),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn(
    'studio_pricings',
    'full_class_price',
  ),
};
