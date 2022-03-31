'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    const instructorAssociation = 'update dibs_studio_instructors set dibs_studio_id = (SELECT dibs_studios.id as id from dibs_studios where dibs_studios.studioid = dibs_studio_instructors.studioid AND dibs_studios.source = dibs_studio_instructors.source)';
    const locationAssociation = 'update dibs_studio_locations set dibs_studio_id = (SELECT dibs_studios.id as id from dibs_studios where dibs_studios.studioid = dibs_studio_locations.studioid AND dibs_studios.source = dibs_studio_locations.source)';
    return queryInterface.addColumn('dibs_studio_locations', 'dibs_studio_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'dibs_studios',
        key: 'id'
      }
    }).then(() =>
    queryInterface.addColumn('dibs_studio_instructors', 'dibs_studio_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'dibs_studios',
        key: 'id'
      }
    }))
    .then(() =>
      queryInterface.sequelize.query(instructorAssociation)
    )
    .then(() =>
      queryInterface.sequelize.query(locationAssociation))

  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('update dibs_studio_instructors set dibs_studio_id = null')
    .then(() => queryInterface.sequelize.query('update dibs_studio_locations set dibs_studio_id = null'))
    .then(() => queryInterface.removeColumn('dibs_studio_locations', 'dibs_studio_id'))
    .then(() => queryInterface.removeColumn('dibs_studio_instructors', 'dibs_studio_id'))
  }
};
