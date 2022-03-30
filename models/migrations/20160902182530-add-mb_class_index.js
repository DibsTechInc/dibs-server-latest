'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('DELETE FROM events WHERE mbstudioid = -99991')
    .then(function(){
      return queryInterface.addIndex('events',
      ['mbstudioid', 'mbclassid'],
      {
        indexName: 'mb_studio_class_index',
        indicesType: 'UNIQUE'
      })
    }).then(function(){
       queryInterface.sequelize.query('ALTER TABLE events ADD CONSTRAINT mb_studio_class UNIQUE USING INDEX mb_studio_class_index')
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('ALTER TABLE events DROP CONSTRAINT if exists mb_studio_class').then(function(){
       queryInterface.removeIndex('events', 'mb_studio_class_index')
    })
  }
};
