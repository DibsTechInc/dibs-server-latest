'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable("removal_requests", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      studioid: {
        type: Sequelize.INTEGER
      },
      classDate: {
        type: Sequelize.STRING
      },
      classTime: {
        type: Sequelize.STRING
      },
      locationName: {
        type: Sequelize.STRING
      },
      locationid: {
        type: Sequelize.INTEGER
      },
      studioClassName: {
        type: Sequelize.STRING
      },
      trainerName: {
        type: Sequelize.STRING
      },
      trainerid: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: Sequelize.DATE,
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable("removal_requests");
  }
};
