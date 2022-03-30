'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable('attendees', {
      attendeeID: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      studioID: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      classID: Sequelize.INTEGER,

      clientID: Sequelize.INTEGER,
      email: Sequelize.STRING,

      serviceID: Sequelize.INTEGER,
      serviceName: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    })
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable('attendees')
  }
};
