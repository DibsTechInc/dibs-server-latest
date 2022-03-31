'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('dibs_admins', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstname: Sequelize.STRING,
      lastname: Sequelize.STRING,
      email: Sequelize.STRING,
      picture_url: Sequelize.STRING,
      password: Sequelize.STRING,
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: queryInterface.sequelize.fn('now'),
      },
      updatedAt: Sequelize.DATE,
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('dibs_admins')
  }
};
