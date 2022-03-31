'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('sms_categories', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      category: {
        type: Sequelize.TEXT,
        unique: true,
      },
      responses: {
        type: Sequelize.JSONB,
      },
      createdAt: Sequelize.DATE,
      updatedAt: { type: Sequelize.DATE, allowNull: true },
      deletedAt: { type: Sequelize.DATE, allowNull: true },
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('sms_categories');
  }
};
