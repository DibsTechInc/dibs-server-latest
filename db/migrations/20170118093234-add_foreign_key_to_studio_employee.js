'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('studio_employees', 'dibs_studio_id', Sequelize.INTEGER)
    .then(() => queryInterface.sequelize.query(`ALTER TABLE public.studio_employees
      ADD CONSTRAINT studio_employees_dibs_studios_fk
      FOREIGN KEY (dibs_studio_id) REFERENCES dibs_studios (id) ON DELETE CASCADE ON UPDATE CASCADE;`));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`Alter Table public.studio_employees
      DROP CONSTRAINT studio_employees_dibs_studios_fk;`)
      .then(() => queryInterface.removeColumn('studio_employees', 'dibs_studio_id'));
  }
};
