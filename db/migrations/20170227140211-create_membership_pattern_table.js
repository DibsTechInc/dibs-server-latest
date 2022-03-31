'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('membership_patterns', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      pattern: Sequelize.STRING,
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: queryInterface.sequelize.fn('NOW')
      },
      updatedAt: Sequelize.DATE,
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('membership_patterns');
  }
};
