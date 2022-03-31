'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('membership_plans', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      stripeid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1
      },
      name: Sequelize.STRING,
      studioid: Sequelize.INTEGER,
      source: Sequelize.STRING(4),
      interval: Sequelize.STRING(5),
      interval_count: Sequelize.INTEGER,
      price: Sequelize.FLOAT,
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE
    }).then(() => queryInterface.addIndex('membership_plans', ['studioid', 'source'], {unique: false}))
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('membership_plans', ['studioid', 'source']).then(() =>
     queryInterface.dropTable('membership_plans'))
  }
};
