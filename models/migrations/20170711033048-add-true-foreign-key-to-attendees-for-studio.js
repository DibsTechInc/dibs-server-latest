'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    const attendeeAssociation = 'update attendees set dibs_studio_id = (SELECT dibs_studios.id as id from dibs_studios where dibs_studios.studioid = attendees."studioID" AND dibs_studios.source = attendees.source)';
    return queryInterface.addColumn('attendees', 'dibs_studio_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'dibs_studios',
        key: 'id'
      }
    })
    .then(() =>
      queryInterface.sequelize.query(attendeeAssociation)
    );
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.sequelize.query('update attendees set dibs_studio_id = null')
    .then(() => queryInterface.removeColumn('attendees', 'dibs_studio_id'))
  }
};
