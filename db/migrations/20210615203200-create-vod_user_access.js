'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('vod_user_access', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      dibs_studio_id: Sequelize.DataTypes.INTEGER,
      userid: Sequelize.DataTypes.INTEGER,
      videoid: Sequelize.DataTypes.INTEGER,
      url: Sequelize.DataTypes.STRING,
      createdAt: Sequelize.DATE,
      expiresAt: Sequelize.DataTypes.DATE,
      updatedAt: { type: Sequelize.DATE, allowNull: true },
      deletedAt: { type: Sequelize.DATE, allowNull: true },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('vod_user_access');
  }
};