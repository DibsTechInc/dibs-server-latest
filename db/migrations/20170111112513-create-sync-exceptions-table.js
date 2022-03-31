'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('sync_exceptions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      studioid: Sequelize.INTEGER,
      source: Sequelize.STRING(4),
      pattern: Sequelize.STRING,
      instructorid: Sequelize.INTEGER,
      classid: Sequelize.INTEGER,
      locationid: Sequelize.INTEGER,
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: Sequelize.DATE,
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('sync_exceptions');
  }
};
