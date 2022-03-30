'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('experiments', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: Sequelize.STRING, allowNull: false, unique: true },
    description: { type: Sequelize.TEXT },
    active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    modular_base: { type: Sequelize.INTEGER, allowNull: false },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
    deletedAt: Sequelize.DATE,
  }),

  down: (queryInterface) => queryInterface.dropTable('experiments')
};
