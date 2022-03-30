'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.renameColumn('dibs_studios', 'dibs_config', 'tmp_dibs_config'),

  down: (queryInterface, Sequelize) => queryInterface.renameColumn('dibs_studios', 'tmp_dibs_config', 'dibs_config'),
};
