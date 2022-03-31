'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('dibs_studios', 'liveAdmin', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    return queryInterface.sequelize.query(
      'UPDATE dibs_studios SET "liveAdmin" = CASE WHEN live IS NULL THEN FALSE ELSE live END;'
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('dibs_studios', 'liveAdmin');
  }
};
