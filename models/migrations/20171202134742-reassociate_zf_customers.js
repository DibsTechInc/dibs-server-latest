'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`ALTER TABLE public.zf_services DROP CONSTRAINT zf_services_studioid_fkey;`)
    .then(() =>
      queryInterface.addColumn('zf_services', 'dibs_studio_id', 
      { type: Sequelize.INTEGER,
        references: {
          model: 'dibs_studios',
          key: 'id'
        },
      })
    )
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
