'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('zf_customers', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: false,
      },
      studioid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: false,
      },
      email: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('zf_customers');
  }
};
