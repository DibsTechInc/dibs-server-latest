'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('my_studios', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      dibs_studio_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'dibs_studios',
          key: 'id'
        }
      },
      userid: {
        type: Sequelize.INTEGER,
        references: {
          model: 'dibs_users',
          key: 'id'
        }
      },
      studioid: Sequelize.INTEGER,
      source: Sequelize.STRING(4),
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: Sequelize.DATE,
    }).then(() => queryInterface.addIndex('my_studios', ['source', 'studioid'], { unique: true }))
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('my_studios', ['source', 'studioid'])
    .then(() => queryInterface.dropTable('my_studios'));
  }
};
