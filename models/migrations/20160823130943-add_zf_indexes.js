'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

    return queryInterface.addIndex('events',
    ['zfstudio_id', 'zfclass_id', 'zfsite_id'],
    {
      indexName: 'zfclass_index',
      indicesType: 'UNIQUE'
    }).then(function(){
      return queryInterface.sequelize.query('ALTER TABLE events ADD CONSTRAINT zfstudio_class UNIQUE USING INDEX zfclass_index')
    })
  },

  down: function (queryInterface, Sequelize) {

    return queryInterface.sequelize.query('ALTER TABLE events DROP CONSTRAINT if exists zfstudio_class').then(function(){
      return queryInterface.removeIndex('events', 'zfclass_index')
    })
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
