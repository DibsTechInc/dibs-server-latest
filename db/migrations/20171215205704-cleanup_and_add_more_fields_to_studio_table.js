'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('dibs_studios', 'dibs_contact'),
      queryInterface.removeColumn('dibs_studios', 'dibs_phone'),
      queryInterface.removeColumn('dibs_studios', 'dibs_email'),
      queryInterface.removeColumn('dibs_studios', 'optimizations'),
      queryInterface.removeColumn('dibs_studios', 'incentives'),
      queryInterface.removeColumn('dibs_studios', 'incentive_amount'),
      queryInterface.removeColumn('dibs_studios', 'iframe'),
      queryInterface.removeColumn('dibs_studios', 'source_access'),
      queryInterface.removeColumn('dibs_studios', 'password'),
      queryInterface.removeColumn('dibs_studios', 'enable_location_filter'),
      queryInterface.removeColumn('dibs_studios', 'status'),
      queryInterface.removeColumn('dibs_studios', 'deleted'),
      queryInterface.removeColumn('dibs_studios', 'source_username'),
      queryInterface.removeColumn('dibs_studios', 'source_password'),
      queryInterface.removeColumn('dibs_studios', 'internal_studio'),
      queryInterface.removeColumn('dibs_studios', 'resync_location'),
      queryInterface.addColumn('dibs_studios', 'welcome_text', Sequelize.TEXT),
      queryInterface.addColumn('dibs_studios', 'hero_url', Sequelize.STRING),
      queryInterface.addColumn('dibs_studios', 'color_logo', Sequelize.STRING),
    ])
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('dibs_studios', 'dibs_contact', Sequelize.STRING),
      queryInterface.addColumn('dibs_studios', 'dibs_phone', Sequelize.STRING),
      queryInterface.addColumn('dibs_studios', 'dibs_email', Sequelize.STRING),
      queryInterface.addColumn('dibs_studios', 'optimizations', Sequelize.STRING),
      queryInterface.addColumn('dibs_studios', 'incentives', Sequelize.JSON),
      queryInterface.addColumn('dibs_studios', 'incentive_amount', Sequelize.FLOAT),
      queryInterface.addColumn('dibs_studios', 'iframe', Sequelize.STRING),
      queryInterface.addColumn('dibs_studios', 'source_access', Sequelize.STRING),
      queryInterface.addColumn('dibs_studios', 'password', Sequelize.STRING),
      queryInterface.addColumn('dibs_studios', 'enable_location_filter', Sequelize.BOOLEAN),
      queryInterface.addColumn('dibs_studios', 'status', Sequelize.BOOLEAN),
      queryInterface.addColumn('dibs_studios', 'deleted', Sequelize.BOOLEAN),
      queryInterface.addColumn('dibs_studios', 'source_username', Sequelize.STRING),
      queryInterface.addColumn('dibs_studios', 'source_password', Sequelize.STRING),
      queryInterface.addColumn('dibs_studios', 'internal_studio', Sequelize.STRING),
      queryInterface.addColumn('dibs_studios', 'resync_location', Sequelize.STRING),
      queryInterface.removeColumn('dibs_studios', 'welcome_text'),
      queryInterface.removeColumn('dibs_studios', 'hero_url'),
      queryInterface.removeColumn('dibs_studios', 'color_logo'),
      
    ])
  }
};
