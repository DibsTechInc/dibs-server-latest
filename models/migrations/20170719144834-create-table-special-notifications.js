'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('special_notifications', {
      id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },
      studioid: {
        type: Sequelize.INTEGER,
      },
      source: {
        type: Sequelize.STRING(4),
      },
      message: {
        type: Sequelize.TEXT,
      },
      showOnlyUsers: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      showUntil: {
        type: Sequelize.DATE,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('special_notifications');
  }
};
