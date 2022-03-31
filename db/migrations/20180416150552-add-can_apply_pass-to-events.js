'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'events',
    'can_apply_pass',
    {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    }
  ),

  down: queryInterface => queryInterface.removeColumn('events', 'can_apply_pass'),
};
