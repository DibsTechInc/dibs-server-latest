'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('receipts', {
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
      flash_credit_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'flash_credits',
          key: 'id',
        },
      },
      credit_transaction_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'credit_transactions',
          key: 'id',
        },
      },
      receipt_amount: Sequelize.FLOAT,
      receipt_date: Sequelize.DATE,
      receipt_notes: Sequelize.TEXT,
      createdAt: Sequelize.DATE,
      updatedAt: { type: Sequelize.DATE, allowNull: true },
      deletedAt: { type: Sequelize.DATE, allowNull: true },
    });
    await queryInterface.createTable('favorite_brands', {
      dibs_portal_userid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: false,
        references: {
          model: 'dibs_portal_users',
          key: 'id',
        },
      },
      dibs_brand_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: false,
        references: {
          model: 'dibs_brands',
          key: 'id',
        },
      },
      favorited: Sequelize.BOOLEAN,
      received_initial_fc: Sequelize.BOOLEAN,
      createdAt: Sequelize.DATE,
      updatedAt: { type: Sequelize.DATE, allowNull: true },
      deletedAt: { type: Sequelize.DATE, allowNull: true },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('receipts');
    await queryInterface.dropTable('favorite_brands');
  },
};
