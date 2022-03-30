'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('zf_instructors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      zfstudio_id: {
        type: Sequelize.INTEGER
      },
      zfinstructor_id: {
        type: Sequelize.INTEGER
      },
      firstname: {
        type: Sequelize.TEXT
      },
      lastname: {
        type: Sequelize.TEXT
      },
      email: {
        type: Sequelize.TEXT
      },
      birthdate: {
        type: Sequelize.STRING
      },
      enabled: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('zf_instructors');
  }
};
