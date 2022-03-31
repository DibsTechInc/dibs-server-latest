'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

    return queryInterface.createTable('mb_programs', {
      mbprogramid: Sequelize.INTEGER,
      mbstudioid: Sequelize.INTEGER,
      name: Sequelize.STRING,
      mb_label_service_id: Sequelize.INTEGER,
      status: Sequelize.INTEGER,
      deleted: Sequelize.INTEGER,
      createdAt: Sequelize.DATE,
      updatedAt: { type: Sequelize.DATE, allowNull: true }
    }).then( () =>{
      return queryInterface.addIndex('mb_programs', ['mbprogramid', 'mbstudioid'])
    })
  },

  down: function (queryInterface, Sequelize) {

    return queryInterface.removeIndex('mb_programs', ['mbprogramid', 'mbstudioid'])
    .then( () => queryInterface.dropTable('mb_programs'))
  }
};
