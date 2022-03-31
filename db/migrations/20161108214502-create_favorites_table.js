'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('favorites', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey:        true,
        autoIncrement:     true
      },
      userid: {
        type: Sequelize.INTEGER,
        references: { model: 'dibs_users', key: 'id' }
      },
      studioid: {
        type: Sequelize.INTEGER,
        reference: { model: 'dibs_user_studios', key: 'studioid'  }
      },
      source: { type: Sequelize.STRING },
      courseName: { type: Sequelize.STRING },
      // The following value is stored as a string because Postgres will not allow
      // me to set an integer to NULL
      instructorid: { type: Sequelize.STRING },
      createdAt: Sequelize.DATE,
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    }).then(() => queryInterface.addIndex('favorites', ['userid'], { unique: false }));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('favorites', ['userid'])
      .then(() => queryInterface.dropTable('favorites'));
  }
};
