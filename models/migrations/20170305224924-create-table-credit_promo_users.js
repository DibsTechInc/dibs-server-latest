'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('credit_promo_users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      promoid: {
        type: Sequelize.INTEGER,
        references: {
          model: 'promo_codes',
          key: 'id',
        },
      },
      userid: {
        type: Sequelize.INTEGER,
        references: {
          model: 'dibs_users',
          key: 'id',
        },
      },
      source: Sequelize.STRING(4),
      studioid: Sequelize.INTEGER,
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: queryInterface.sequelize.fn('NOW'),
      },
      updatedAt: Sequelize.DATE,
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('credit_promo_users');
  }
};
