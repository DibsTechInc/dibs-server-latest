'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('user_studio_requests', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      studioName: {
        type: Sequelize.STRING,
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('user_studio_requests');
  }
};
