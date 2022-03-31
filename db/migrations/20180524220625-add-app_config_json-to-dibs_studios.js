'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('dibs_studios', 'app_config_json', {
      type: Sequelize.JSONB,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('dibs_studios', 'app_config_json');
  }
};
