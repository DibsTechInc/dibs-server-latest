'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('dibs_studios', 'requiresWaiverSigned', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('dibs_studios', 'requiresWaiverSigned', {
      type: Sequelize.BOOLEAN,
    });
  }
};
