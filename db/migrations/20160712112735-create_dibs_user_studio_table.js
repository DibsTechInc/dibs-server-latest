'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {


    return queryInterface.createTable('dibs_user_studios', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userid: {
        type: Sequelize.INTEGER
      },
      studioid: {
        type: Sequelize.INTEGER
      },
      clientid: {
        type: Sequelize.TEXT
      },
      source: {
        type: Sequelize.STRING(4)
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    }).then(function(){
      queryInterface.addIndex('dibs_user_studios', ['userid', 'studioid', 'source'],
      {
        indexName: 'dibs_user_studio_index',
      })
    })
  },

  down: function (queryInterface, Sequelize) {

    return queryInterface.removeIndex('dibs_user_studios', 'dibs_user_studio_index').then(function(){
      return queryInterface.dropTable('dibs_user_studios')
    })
  }
};
