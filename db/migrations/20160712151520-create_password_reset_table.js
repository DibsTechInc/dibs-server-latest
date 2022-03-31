'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable('password_resets', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      uuidParam: Sequelize.UUID,
      userID: Sequelize.INTEGER,
      createdAt: Sequelize.DATE,
      updatedAt: { type: Sequelize.DATE, allowNull: true }
    })

  },

  down: function (queryInterface, Sequelize) {

    return queryInterface.dropTable('password_resets');

  }
};
