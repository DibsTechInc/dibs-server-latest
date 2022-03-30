'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('mb_user_studios', {
      mbuserid: Sequelize.INTEGER,
      mbstudioid: Sequelize.INTEGER,
      mbclientid: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: { type: Sequelize.DATE, allowNull: true }
    }).then(() => queryInterface.addIndex('mb_user_studios', ['mbuserid', 'mbstudioid']))
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('mb_user_studios',  ['mbuserid', 'mbstudioid'])
    .then(() => queryInterface.dropTable('mb_user_studios'))
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
