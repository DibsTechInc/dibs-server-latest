'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('studio_credit_special_tiers', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      source: {
        type: Sequelize.STRING,
      },
      studioid: {
        type: Sequelize.INTEGER,
      },
      payAmount: {
        type: Sequelize.INTEGER,
      },
      receiveAmount: {
        type: Sequelize.INTEGER,
      },
      usesPerUser: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      totalUses: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: Sequelize.DATE,
      expireAt: Sequelize.DATE,
      updatedAt: { type: Sequelize.DATE, allowNull: true },
      deletedAt: { type: Sequelize.DATE, allowNull: true },
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('studio_credit_special_tiers');
  }
};
