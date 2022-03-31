'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('zoom_notification', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      eventid: Sequelize.DataTypes.INTEGER,
      email: Sequelize.DataTypes.STRING,
      userid: Sequelize.DataTypes.INTEGER,
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('zoom_notification');
  }
};
