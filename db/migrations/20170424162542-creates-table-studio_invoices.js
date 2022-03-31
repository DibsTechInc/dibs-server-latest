'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('studio_invoices', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      source: Sequelize.STRING(4),
      studioid: Sequelize.INTEGER,
      locationid: { type: Sequelize.INTEGER, allowNull: true },
      start_date: Sequelize.DATE,
      end_date: Sequelize.DATE,
      balance: Sequelize.FLOAT,
      paid: { type: Sequelize.BOOLEAN, defaultValue: false },
      notes: { type: Sequelize.TEXT, allowNull: true },
      createdAt: Sequelize.DATE,
      updatedAt: { type: Sequelize.DATE, allowNull: true },
      deletedAt: { type: Sequelize.DATE, allowNull: true },
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('studio_invoices');
  }
};
