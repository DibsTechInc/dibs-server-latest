'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('dibs_user_studios', 'temp_signed_waiver', {
      type: Sequelize.DATE,
      defaultValue: null,
    });
    await queryInterface.sequelize.query(`UPDATE dibs_user_studios SET temp_signed_waiver = "updatedAt" WHERE signed_waiver = true`)
    await queryInterface.removeColumn('dibs_user_studios', 'signed_waiver');
    return queryInterface.renameColumn('dibs_user_studios', 'temp_signed_waiver', 'signed_waiver');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('dibs_user_studios', 'temp_signed_waiver', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.sequelize.query(`UPDATE dibs_user_studios SET temp_signed_waiver = true WHERE signed_waiver IS NOT NULL`)
    await queryInterface.removeColumn('dibs_user_studios', 'signed_waiver');
    await queryInterface.renameColumn('dibs_user_studios', 'temp_signed_waiver', 'signed_waiver');
  }
};
