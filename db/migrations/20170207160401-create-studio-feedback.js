'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('studio_feedback', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      userid: {
        type: Sequelize.INTEGER,
        references: {
          model: 'dibs_users',
          key: 'id'
        }
      },
      comments: Sequelize.TEXT,
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: Sequelize.DATE,
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('studio_feedback');
  }
};
