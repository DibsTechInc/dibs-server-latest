'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('credit_transactions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      creditid: {
        type: Sequelize.INTEGER,
        references: {
          model: 'credits',
          key: 'id',
        },
      },
      transaction_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'dibs_transactions',
          key: 'id',
        },
      },
      before_credit: Sequelize.FLOAT,
      after_credit: Sequelize.FLOAT,
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: queryInterface.sequelize.fn('now'),
      },
      deletedAt: Sequelize.DATE,
    });
    await queryInterface.addIndex('credit_transactions', ['creditid'], { unique: false });
    return queryInterface.addIndex('credit_transactions', ['transaction_id'], { unique: false });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('credit_transactions', ['creditid'], { unique: false });
    await queryInterface.removeIndex('credit_transactions', ['transaction_id'], { unique: false });
    return queryInterface.dropTable('credit_transactions');
  }
};
