'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('blog_posts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: Sequelize.STRING,
      content: Sequelize.TEXT,
      rawText: Sequelize.TEXT,
      dibs_admin_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'dibs_admins',
        },
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE,
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('blog_posts')
  }
};
