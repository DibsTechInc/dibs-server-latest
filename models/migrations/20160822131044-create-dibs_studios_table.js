'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('dibs_studios', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: Sequelize.STRING,
      login: Sequelize.STRING,
      password: Sequelize.STRING,
      studioid: Sequelize.INTEGER,
      source: Sequelize.STRING(4),
      dibs_contact: Sequelize.STRING,
      dibs_phone: Sequelize.STRING,
      dibs_email: Sequelize.STRING,
      billing_contact: Sequelize.STRING,
      billing_email: Sequelize.STRING,
      optimizations: Sequelize.JSONB,
      incentives: Sequelize.BOOLEAN,
      incentive_amount: Sequelize.INTEGER,
      iframes: Sequelize.JSONB,
      createdAt: Sequelize.DATE,
      updatedAt: { type: Sequelize.DATE, allowNull: true }
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('dibs_studios')
  }
};
