'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('portal_credit_transactions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userid: {
        type: Sequelize.INTEGER,
        references: {
          model: 'dibs_portal_users',
          key: 'id',
        },
      },
      creditid: {
        type: Sequelize.INTEGER,
        references: {
          model: 'credits',
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
      before_credit: Sequelize.FLOAT,
      after_credit: Sequelize.FLOAT,
      flash_credit_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'flash_credits',
          key: 'id',
        },
      },
      referred_by_userid: {
        type: Sequelize.INTEGER,
        references: {
          model: 'dibs_portal_users',
          key: 'id',
        },
      },
      referral_redeemed_userid: {
        type: Sequelize.INTEGER,
        references: {
          model: 'dibs_portal_users',
          key: 'id',
        },
      },
      type: Sequelize.STRING,
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: queryInterface.sequelize.fn('now'),
      },
      deletedAt: Sequelize.DATE,
    });
    return queryInterface.addIndex('portal_credit_transactions', ['creditid'], { unique: false });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('portal_credit_transactions', ['creditid'], { unique: false });
    return queryInterface.dropTable('portal_credit_transactions');
  }
};
