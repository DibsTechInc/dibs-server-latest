'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('custom_events_attributes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      dibs_studio_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'dibs_studios',
          key: 'id',
        },
      },
      event_name: {
        type: Sequelize.STRING,
      },
      notice_message: {
        type: Sequelize.TEXT,
      },
      createdAt: Sequelize.DATE,
      updatedAt: { type: Sequelize.DATE, allowNull: true },
      deletedAt: { type: Sequelize.DATE, allowNull: true },
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('custom_events_attributes');
  }
};

