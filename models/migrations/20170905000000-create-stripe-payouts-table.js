'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('stripe_payouts', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        autoIncrement: false,
        unique: true,
      },
      stripe_account_id: Sequelize.STRING,
      object: Sequelize.STRING,
      amount: Sequelize.INTEGER,
      arrival_date: Sequelize.DATE,
      balance_transaction: Sequelize.STRING,
      created: Sequelize.INTEGER,
      currency: Sequelize.STRING(3),
      description: Sequelize.STRING,
      destination: Sequelize.STRING,
      failure_balance_transaction: Sequelize.STRING,
      failure_code: Sequelize.STRING,
      failure_message: Sequelize.STRING,
      livemode: Sequelize.BOOLEAN,
      metadata: Sequelize.JSONB,
      method: Sequelize.STRING,
      source_type: Sequelize.STRING,
      statement_descriptor: Sequelize.STRING,
      status: Sequelize.STRING,
      type: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE,
    })
    .then(() => queryInterface.addIndex('stripe_payouts', ['id'], { unique: true }))
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('stripe_payouts');
  }
};
