'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'studio_packages',
    'expires_after_first_booking',
    {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    }
  ),

  down: queryInterface => queryInterface.removeColumn('studio_packages', 'expires_after_first_booking'),
};
