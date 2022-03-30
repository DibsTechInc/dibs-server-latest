'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable("dibs_effects", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      totalLocations: {
        type: Sequelize.INTEGER,
      },
      spotsPerLocation: {
        type: Sequelize.INTEGER,
      },
      classesPerDay: {
        type: Sequelize.INTEGER,
      },
      avgFillRate: {
        type: Sequelize.FLOAT,
      },
      avgPricePaid: {
        type: Sequelize.FLOAT,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: Sequelize.DATE,
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable("dibs_effects");
  }
};
