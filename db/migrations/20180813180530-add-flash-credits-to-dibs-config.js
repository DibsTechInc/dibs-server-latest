'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('dibs_configs', 'send_flash_credits', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
    return queryInterface.sequelize.query(
      'UPDATE dibs_configs SET send_flash_credits = TRUE FROM dibs_studios WHERE dibs_studios.id = dibs_configs.dibs_studio_id AND dibs_studios.live = TRUE');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('dibs_configs', 'send_flash_credits');
  }
};
