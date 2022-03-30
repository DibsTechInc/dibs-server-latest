'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

    return queryInterface.createTable('mb_users', {
        mbuserid: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: false
        },
        mbstudioid: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: false
        },
        name: {
          type: Sequelize.STRING
        },
        pass: {
          type: Sequelize.STRING
        },
        mail: {
          type: Sequelize.STRING
        },
        type: {
          type: Sequelize.STRING
        },
        firstname: {
          type: Sequelize.STRING
        },
        lastname: {
          type: Sequelize.STRING
        },
        gender: {
          type: Sequelize.INTEGER
        },
        title: {
          type: Sequelize.STRING
        },
        photo: {
          type: Sequelize.TEXT
        },
        fb_id: {
          type: Sequelize.STRING
        },
        tw_id: {
          type: Sequelize.STRING
        },
        stripe_id: {
          type: Sequelize.STRING
        },
        status: {
          type: Sequelize.INTEGER
        },
        deleted: {
          type: Sequelize.INTEGER
        },
        source: {
          type: Sequelize.STRING
        },
        data: {
          type: Sequelize.TEXT
        },
        createdAt: Sequelize.DATE,
        updatedAt: { type: Sequelize.DATE, allowNull: true }
    })
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable('mb_users')
  }
};
