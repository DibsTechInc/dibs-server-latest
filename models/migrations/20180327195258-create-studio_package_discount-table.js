'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('studio_package_discounts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      promotion_name: Sequelize.STRING,
      discount_price: Sequelize.FLOAT,
      discount_price_autopay: Sequelize.FLOAT,
      studio_package_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'studio_packages',
          key: 'id',
        },
      },
      promotion_start: {
        type: Sequelize.DATE,
        defaultValue: queryInterface.sequelize.fn('now')
      },
      promotion_end: {
        type: Sequelize.DATE,
        defaultValue: queryInterface.sequelize.literal("now() + INTERVAL '1 month'"),
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: queryInterface.sequelize.fn('now')
      },
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE,
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('studio_package_discounts')
  }
};
