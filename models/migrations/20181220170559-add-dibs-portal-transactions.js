'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('dibs_portal_transactions', {
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
      description: Sequelize.TEXT,
      eventid: {
        type: Sequelize.INTEGER,
        references: {
          model: 'events',
          key: 'eventid',
        },
      },
      flash_credit_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'flash_credits',
          key: 'id',
        },
      },
      stripe_charge_id: Sequelize.STRING,
      stripe_refund_id: Sequelize.STRING,
      amount: Sequelize.FLOAT,
      tax_amount: Sequelize.FLOAT,
      stripe_fee: Sequelize.FLOAT,
      dibs_fee: Sequelize.FLOAT,
      brand_payment: Sequelize.FLOAT,
      void: Sequelize.BOOLEAN,
      createdAt: Sequelize.DATE,
      updatedAt: { type: Sequelize.DATE, allowNull: true },
      deletedAt: { type: Sequelize.DATE, allowNull: true },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('dibs_portal_transactions');
  },
};
