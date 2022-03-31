'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn('dibs_configs', 'textColor', {
    type: Sequelize.STRING(6),
    defaultValue: 'ffffff',
  }),

  down: (queryInterface, Sequelize) => queryInterface.changeColumn('dibs_configs', 'textColor', {
    type: Sequelize.STRING(6),
  }),
};
