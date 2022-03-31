'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('credit_tiers', {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      dibs_studio_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'dibs_studios',
          key: 'id',
        },
      },
      payAmount: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      loadBonus: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('credit_tiers');
  }
};
