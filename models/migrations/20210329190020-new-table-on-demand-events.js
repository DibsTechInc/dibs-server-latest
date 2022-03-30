'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('on_demand_events', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      dibs_studio_id: Sequelize.DataTypes.INTEGER,
      title: Sequelize.DataTypes.STRING,
      short_description: Sequelize.DataTypes.STRING,
      long_description: Sequelize.DataTypes.STRING,
      length: Sequelize.DataTypes.INTEGER,
      intensity: Sequelize.DataTypes.INTEGER,
      price: Sequelize.DataTypes.FLOAT,
      category: Sequelize.DataTypes.STRING,
      show_video: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: true,
      },
      createdAt: Sequelize.DATE,
      updatedAt: { type: Sequelize.DATE, allowNull: true },
      deletedAt: { type: Sequelize.DATE, allowNull: true },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('on_demand_events');
  }
};