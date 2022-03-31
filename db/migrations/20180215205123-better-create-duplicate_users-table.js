'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('duplicate_users');
    return queryInterface.createTable('duplicate_users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userid: {
        type: Sequelize.INTEGER,
      },
      clientid: {
        type: Sequelize.STRING,
      },
      dibs_studio_id: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('duplicate_users');
    return queryInterface.createTable('duplicate_users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userid: {
        type: Sequelize.INTEGER,
      },
      clientid: {
        type: Sequelize.STRING,
      },
      dibs_studio_id: {
        type: Sequelize.INTEGER,
      },
    });
  }
};
