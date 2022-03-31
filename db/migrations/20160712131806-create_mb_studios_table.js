'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('mb_studios',
    {
      mbstudioid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: false
      },
      domain: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      logo: {
        type: Sequelize.TEXT
      },
      access: {
        type: Sequelize.INTEGER
      },
      password: {
        type: Sequelize.STRING
      },
      enable_location_filter: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.INTEGER
      },
      deleted: {
        type: Sequelize.INTEGER
      },
      mb_username: {
        type: Sequelize.STRING
      },
      mb_password: {
        type: Sequelize.STRING
      },
      internal_studio: {
        type: Sequelize.INTEGER
      },
      resync_location: {
        type: Sequelize.INTEGER
      },
      timezone: {
        type: Sequelize.STRING
      },
      createdAt: Sequelize.DATE,
      updatedAt: { type: Sequelize.DATE, allowNull: true }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('mb_studios')
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
