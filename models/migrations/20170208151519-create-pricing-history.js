'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('pricing_history', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      eventid: {
        type: Sequelize.INTEGER,
        references: {
          model: 'events',
          key: 'eventid'
        }
      },
      currentPrice: Sequelize.INTEGER,
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: Sequelize.DATE,
    });
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.dropTable('pricing_history');
  }
};
