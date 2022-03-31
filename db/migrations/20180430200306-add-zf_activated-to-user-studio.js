'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('dibs_user_studios', 'zf_activated', { type: Sequelize.BOOLEAN, defaultValue: false });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('dibs_user_studios', 'zf_activated');
  }
};
