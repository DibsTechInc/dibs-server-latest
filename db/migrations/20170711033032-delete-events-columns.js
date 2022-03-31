'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('events', 'mbstudioid')
    .then(() => queryInterface.removeColumn('events', 'mbclassid'))
    .then(() => queryInterface.removeColumn('events', 'mbprogramid'))
    .then(() => queryInterface.removeColumn('events', 'mblocationid'))
    .then(() => queryInterface.removeColumn('events', 'zfisfull'))
    .then(() => queryInterface.removeColumn('events', 'zfsite_id'))
    .then(() => queryInterface.removeColumn('events', 'zfstudio_id'))
    .then(() => queryInterface.removeColumn('events', 'zfclass_id'))
    .then(() => queryInterface.removeColumn('events', 'zfinstructor_id'))
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
