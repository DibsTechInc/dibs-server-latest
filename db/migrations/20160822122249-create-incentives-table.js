'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('incentives', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: Sequelize.STRING,
      invite_code: Sequelize.TEXT,
      studioid: Sequelize.INTEGER,
      source: Sequelize.STRING(4),
      expiration: Sequelize.DATE,
      credit: Sequelize.FLOAT,
      createdAt: Sequelize.DATE,
      updatedAt: { type: Sequelize.DATE, allowNull: true },
      deletedAt: Sequelize.DATE
    })
    .then(() => queryInterface.addIndex('incentives', ['studioid', 'source', 'email']))
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('incentives', ['studioid', 'source', 'email'])
    .then(() => queryInterface.dropTable('incentives'))
  }
};
