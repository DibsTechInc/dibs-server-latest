'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      DELETE FROM
      events t1 WHERE (
        SELECT count(*)
        FROM events t2
        WHERE t2.classid = t1.classid
        AND t2.studioid = t1.studioid
        AND t2.source = t1.source
      ) > 1;
    `) // should be 1 pair of events
    .then(() => queryInterface.removeIndex('events', 'studio_class_index'))
    .then(() => queryInterface.addIndex(
      'events',
      ['source', 'studioid', 'classid'],
      {
        indexName: 'studio_class_index',
        indicesType: 'UNIQUE'
      }
    ))
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('events', 'studio_class_index')
    .then(() => queryInterface.addIndex(
      'events',
      ['source', 'studioid', 'classid', 'locationid'],
      {
        indexName: 'studio_class_index',
        indicesType: 'UNIQUE'
      }
    ))
  }
};
