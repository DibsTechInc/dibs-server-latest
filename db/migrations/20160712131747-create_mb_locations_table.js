'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('mb_locations',
    {
      mblocationid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: false
      },
      mbstudioid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: false
      },
      name: {
        type: Sequelize.TEXT
      },
      phone: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      address2: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      zipcode: {
        type: Sequelize.STRING
      },
      latitude: {
        type: Sequelize.STRING
      },
      longitude: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.INTEGER
      },
      deleted: {
        type: Sequelize.INTEGER
      },
      createdAt: Sequelize.DATE,
      updatedAt: { type: Sequelize.DATE, allowNull: true }
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('mb_locations')
  }
};
