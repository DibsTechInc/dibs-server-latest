'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('email_verifications', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      uuidParam: Sequelize.UUID,
      userid: Sequelize.INTEGER,
      user_mobilephone: Sequelize.TEXT,
      user_country: Sequelize.STRING(2),
      flow_responsepath: Sequelize.TEXT,
      createdAt: Sequelize.DATE,
      updatedAt: { type: Sequelize.DATE, allowNull: true },
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('email_verifications');
  }
};
