'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('short_codes', 'generated_at', { type: Sequelize.DATE });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('short_codes', 'generated_at');
  }
};
