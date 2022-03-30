'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('price_bands', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      dibs_studio_id: Sequelize.INTEGER,
      class_name: Sequelize.STRING,
      mean: Sequelize.INTEGER,
      fill_rate: Sequelize.FLOAT,
      band_number: Sequelize.INTEGER,
      createdAt: Sequelize.DATE,
      updatedAt: { type: Sequelize.DATE, allowNull: true },
      deletedAt: { type: Sequelize.DATE, allowNull: true },

    });
    await queryInterface.addColumn('events', 'is_recurring', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('price_bands');
    await queryInterface.removeColumn('events', 'is_recurring');
  }
};
