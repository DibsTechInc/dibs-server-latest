'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable('revenue_reference', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    studioID: Sequelize.INTEGER,
    paymentCategory: Sequelize.STRING,
    DibsCategory1: Sequelize.STRING,
    DibsCategory2: Sequelize.STRING,
    avgRevenue: Sequelize.FLOAT,
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW')
    },
    updatedAt: Sequelize.DATE
    })
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable('revenue_reference')
  }
};
