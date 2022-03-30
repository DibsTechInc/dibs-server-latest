'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('dibs_cash_out_requests', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      dibs_portal_userid: {
        type: Sequelize.INTEGER,
        references: {
          model: 'dibs_portal_users',
          key: 'id',
        },
      },
      dibs_brand_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'dibs_brands',
          key: 'id',
        },
      },
      amount_paid: Sequelize.FLOAT,
      amount_removed_from_account: Sequelize.FLOAT,
      pending: Sequelize.BOOLEAN,
      paid: Sequelize.BOOLEAN,
      rejected: Sequelize.BOOLEAN,
      notes: Sequelize.TEXT,
      date_processed: Sequelize.DATE,
      createdAt: Sequelize.DATE,
      updatedAt: { type: Sequelize.DATE, allowNull: true },
      deletedAt: { type: Sequelize.DATE, allowNull: true },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('dibs_cash_out_requests');
  },
};
