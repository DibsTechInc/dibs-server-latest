'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    const eventAssociation = 'update events set dibs_studio_id = (SELECT dibs_studios.id as id from dibs_studios where dibs_studios.studioid = events.studioid AND dibs_studios.source = events.source)';
    return queryInterface.addColumn('events', 'dibs_studio_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'dibs_studios',
        key: 'id'
      }
    })
    .then(() =>
      queryInterface.sequelize.query(eventAssociation)
    );
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.sequelize.query('update events set dibs_studio_id = null')
    .then(() => queryInterface.removeColumn('events', 'dibs_studio_id'))
  }
};
