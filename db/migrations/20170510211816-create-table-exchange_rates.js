'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('exchange_rates', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      rate: Sequelize.FLOAT,
      from: Sequelize.STRING(3),
      to: Sequelize.STRING(3),
      createdAt: Sequelize.DATE,
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('exchange_rates');
  }
};
