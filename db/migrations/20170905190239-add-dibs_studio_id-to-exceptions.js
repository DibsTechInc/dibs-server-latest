'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('exceptions', 'dibs_studio_id', {
      type: Sequelize.INTEGER,
    }).then(() => queryInterface.sequelize.query(
      `UPDATE exceptions
       SET dibs_studio_id = (
         SELECT dibs_studios.id
         FROM dibs_studios
         WHERE dibs_studios.source = exceptions.source
           AND dibs_studios.studioid = exceptions.studioid
       );`
    ));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('exceptions', 'dibs_studio_id');
  }
};
