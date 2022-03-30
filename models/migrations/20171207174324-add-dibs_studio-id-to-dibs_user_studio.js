'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
   return queryInterface.addColumn('dibs_user_studios', 'dibs_studio_id', {
     type: Sequelize.INTEGER,
     references: {
       model: 'dibs_studios',
       key: 'id',
     },
   }).then(() => queryInterface.sequelize
   .query('UPDATE dibs_user_studios SET dibs_studio_id = (SELECT dibs_studios.id FROM dibs_studios WHERE dibs_studios.studioid = dibs_user_studios.studioid AND dibs_studios.source = dibs_user_studios.source)')); 
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_user_studios', 'dibs_studio_id');
  }
};
