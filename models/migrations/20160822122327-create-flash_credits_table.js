'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('flash_credits', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userid: Sequelize.INTEGER,
      studioid: Sequelize.INTEGER,
      source: Sequelize.STRING(4),
      expiration: Sequelize.DATE,
      credit: Sequelize.FLOAT,
      createdAt: Sequelize.DATE,
      updatedAt: { type: Sequelize.DATE, allowNull: true },
      deletedAt: Sequelize.DATE
    })
    .then(() => queryInterface.addIndex('flash_credits', ['studioid', 'userid', 'source']))
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('flash_credits', ['studioid', 'userid', 'source'])
    .then(() => queryInterface.dropTable('flash_credits'))
  }
};
