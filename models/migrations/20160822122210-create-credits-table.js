'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('credits', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userid: Sequelize.INTEGER,
      studioid: Sequelize.INTEGER,
      credit: Sequelize.FLOAT,
      source: Sequelize.STRING(4),
      createdAt: Sequelize.DATE,
      updatedAt: { type: Sequelize.DATE, allowNull: true }
    }).then(() => queryInterface.addIndex('credits', ['studioid', 'userid', 'source']))
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('credits', ['studioid', 'userid', 'source'])
    .then(() => queryInterface.dropTable('credits'))
  }
};
