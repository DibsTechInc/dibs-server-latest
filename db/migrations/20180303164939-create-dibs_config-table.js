'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('dibs_configs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      dibs_studio_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'dibs_studios',
          key: 'id'
        },
      },
      autopay_minimum: Sequelize.INTEGER,
      studio_fonts: Sequelize.JSON,
      color: Sequelize.STRING(6),
      customTimeFormat: Sequelize.STRING,
      terms: Sequelize.STRING,
      custom_front_text: Sequelize.TEXT,
      textColor: Sequelize.STRING(6),
      onlyLocations: Sequelize.JSON,
      interval_end: {
        type: Sequelize.INTEGER,
        defaultValue: 14,
      },
      default_region: Sequelize.BIGINT,
      custom_back_text: Sequelize.TEXT,
      showWidgetPopup: Sequelize.BOOLEAN,
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('dibs_configs');
  }
};
