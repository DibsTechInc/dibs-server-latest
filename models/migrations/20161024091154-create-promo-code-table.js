'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('promo_codes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      amount: {
        type: Sequelize.FLOAT
      },
      code: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING(3)
      },
      expiration: {
        type: Sequelize.DATE
      },
      unique: {
        type: Sequelize.BOOLEAN
      },
      studioid: {
        type: Sequelize.INTEGER
      },
      source: {
        type: Sequelize.STRING(4)
      },
      code_usage_limit: {
        type: Sequelize.INTEGER
      },
      user_usage_limit: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    }).then(() =>
      queryInterface.addIndex('promo_codes', ['studioid', 'source'])
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('promo_codes')
    .then(() => {
      queryInterface.removeIndex('promo_codes', ['studioid', 'source'])
    })
  }
};
