'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('sms_phrases', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      categoryid: {
        type: Sequelize.INTEGER,
      },
      phrase: {
        type: Sequelize.TEXT,
        unique: true,
      },
      createdAt: Sequelize.DATE,
      updatedAt: { type: Sequelize.DATE, allowNull: true },
      deletedAt: { type: Sequelize.DATE, allowNull: true },
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('sms_phrases');
  }
};
