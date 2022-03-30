'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all[
      queryInterface.removeColumn('studio_packages', 'source_serviceid'),
      queryInterface.addColumn('studio_packages', 'should_display_name', { type: Sequelize.BOOLEAN, defaultValue: true })
    ]
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all[
      queryInterface.addColumn('studio_packages', 'source_serviceid', Sequelize.INTEGER),
      queryInterface.removeColumn('studio_packages', 'should_display_name')
    ]
  }
};
