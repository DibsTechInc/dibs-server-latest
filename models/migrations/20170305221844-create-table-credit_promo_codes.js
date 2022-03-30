'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('credit_promo_codes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      source: Sequelize.STRING(4),
      studioid: Sequelize.INTEGER,
      expires_on: Sequelize.DATE,
      code: Sequelize.STRING,
      amount_needed: Sequelize.FLOAT,
      amount_awarded: Sequelize.FLOAT,
      user_usage_limit: Sequelize.INTEGER,
      bonus_applies: Sequelize.BOOLEAN,
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: queryInterface.sequelize.fn('NOW'),
      },
      updatedAt: Sequelize.DATE,
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('credit_promo_codes');
  }
};
