'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('dibs_user_studios', 'signed_waiver', {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('dibs_user_studios', 'signed_waiver');
  }
};
