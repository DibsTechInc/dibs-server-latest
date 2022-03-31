'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('dibs_configs', 'maximum_allowed_client_enrollment', {
      type: Sequelize.INTEGER,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('dibs_configs', 'maximum_allowed_client_enrollment');
  }
};
