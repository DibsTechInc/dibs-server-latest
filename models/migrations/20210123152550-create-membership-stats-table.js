'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('membership_stats', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      dibs_studio_id: Sequelize.DataTypes.INTEGER,
      num_memberships: Sequelize.DataTypes.INTEGER,
      num_visits: Sequelize.DataTypes.INTEGER,
      total_revenue: Sequelize.DataTypes.FLOAT, 
      rev_per_visit: Sequelize.DataTypes.FLOAT,
      valid_from: Sequelize.DataTypes.DATE,
      valid_to: Sequelize.DataTypes.DATE,
      createdAt: Sequelize.DATE,
      updatedAt: { type: Sequelize.DATE, allowNull: true },
      deletedAt: { type: Sequelize.DATE, allowNull: true },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('membership_stats');
  }
};
