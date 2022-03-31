'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('studio_employees', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.TEXT
      },
      password: {
        type: Sequelize.TEXT
      },
      source: {
        type: Sequelize.STRING(2)
      },
      studioid: {
        type: Sequelize.INTEGER,
        reference: { model: 'dibs_user_studios', key: 'studioid' }
      },
      admin: {
        type: Sequelize.BOOLEAN
      },
      createdAt: Sequelize.DATE,
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('studio_employees');
  }
};
