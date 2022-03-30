'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('retail_products', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      dibs_studio_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'dibs_studios',
          key: 'id',
        },
      },
      name: Sequelize.STRING,
      description: Sequelize.TEXT,
      price: Sequelize.FLOAT,
      taxable: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: queryInterface.sequelize.fn('now'),
      },
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE,
    });
    return queryInterface.addIndex('retail_products', ['dibs_studio_id'], { unique: false });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('retail_products', ['dibs_studio_id'], { unique: false });
    return queryInterface.dropTable('retail_products');
  }
};
