'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('dibs_studio_locations', 'customer_service_email', {
      type: Sequelize.STRING,
    });
    return queryInterface.addColumn('dibs_studio_locations', 'customer_service_phone', {
      type: Sequelize.STRING,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('dibs_studio_locations', 'customer_service_email');
    return queryInterface.removeColumn('dibs_studio_locations', 'customer_service_phone');
  }
};
