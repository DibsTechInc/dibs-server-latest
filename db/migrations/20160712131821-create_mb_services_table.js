'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('mb_services', {
      mbserviceid: Sequelize.INTEGER,
      mbprogramid: Sequelize.INTEGER,
      mbstudioid: Sequelize.INTEGER,
      name: Sequelize.STRING,
      dibscategory2: Sequelize.STRING(5),
      price: Sequelize.FLOAT,
      online_price: Sequelize.FLOAT,
      createdAt: Sequelize.DATE,
      updatedAt: { type: Sequelize.DATE, allowNull: true }
    }).then(function(){
      return queryInterface.addIndex('mb_services', ['mbstudioid', 'mbprogramid'])
    })
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('mb_services', ['mbstudioid', 'mbprogramid'])
    .then( () => queryInterface.dropTable('mb_services'))
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
