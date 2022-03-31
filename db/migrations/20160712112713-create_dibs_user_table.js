'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

    return queryInterface.createTable('dibs_users', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        firstName: {
          type: Sequelize.STRING
        },
        lastName: {
          type: Sequelize.STRING
        },
        email: {
          type: Sequelize.TEXT
        },
        password: {
          type: Sequelize.TEXT
        },
        mobilephone: {
          type: Sequelize.STRING
        },
        address: {
          type: Sequelize.TEXT
        },
        city: {
          type: Sequelize.TEXT
        },
        state: {
          type: Sequelize.STRING
        },
        zip: {
          type: Sequelize.INTEGER
        },
        birthday: {
          type: Sequelize.STRING
        },
        pictureUrl: {
          type: Sequelize.TEXT
        },
        stripeid: {
          type: Sequelize.TEXT
        },
        stripe_cardid:{
          type: Sequelize.TEXT
        },
        emergencycontactname: {
          type: Sequelize.TEXT
        },
        emergencycontactemail: {
          type: Sequelize.TEXT
        },
        emergencycontactphone: {
          type: Sequelize.TEXT
        },
        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        },
        deletedAt: {
          type: Sequelize.DATE
        }
    })
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable('dibs_users')
  }
};
