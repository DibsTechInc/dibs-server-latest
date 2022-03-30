'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('whitelabel_custom_email_text', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      template: Sequelize.STRING,
      text: Sequelize.TEXT,
      dibs_studio_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'dibs_studios',
          key: 'id',
        }
      },
      createdAt: {
        type: Sequelize.DATE(),
        defaultValue: queryInterface.sequelize.fn('now'),
      },
      updatedAt: {
        type: Sequelize.DATE(),
        defaultValue: queryInterface.sequelize.fn('now'),
      },
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('whitelabel_custom_email_text');
  }
};
