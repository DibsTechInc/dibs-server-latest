'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

    return queryInterface.createTable('zf_sites', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      zfstudio_id: {
        type: Sequelize.INTEGER
      },
      zfsite_id: {
        type: Sequelize.INTEGER
      },
      zfregion_id: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.TEXT
      },
      city: {
        type: Sequelize.STRING
      },
      zip: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.TEXT
      },
      address2: {
        type: Sequelize.TEXT
      },
      timezone: {
        type: Sequelize.TEXT
      },
      latecancelcutoff: {
        type: Sequelize.INTEGER
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
    }).then(() => queryInterface.addIndex('zf_sites', ['zfstudio_id', 'zfsite_id']))
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.removeIndex('zf_sites', ['zfstudio_id', 'zfsite_id'])
    .then(() => queryInterface.dropTable('zf_sites'))
  }
};
