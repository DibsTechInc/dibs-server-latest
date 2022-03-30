'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('get_dibs_requests', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      studioName: {
        type: Sequelize.STRING,
      },
      studioWebsite: {
        type: Sequelize.STRING,
      },
      firstName: {
        type: Sequelize.STRING,
      },
      lastName: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      bookingPlatform: {
        type: Sequelize.STRING,
      },
      otherPlatform: {
        type: Sequelize.STRING,
      },
      bookingUsername: {
        type: Sequelize.STRING,
      },
      bookingPassword: {
        type: Sequelize.STRING,
      },
      routingNumber: {
        type: Sequelize.STRING,
      },
      accountNumber: {
        type: Sequelize.STRING,
      },
      termsAndConditions: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('get_dibs_requests');
  }
};
