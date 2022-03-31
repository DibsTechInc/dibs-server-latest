'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('dibs_users', 'temp_signed_waiver', {
      type: Sequelize.DATE,
      defaultValue: null,
    });
    await queryInterface.sequelize.query(`UPDATE dibs_users SET temp_signed_waiver = "updatedAt" WHERE "waiverSigned" = true`)
    await queryInterface.removeColumn('dibs_users', 'waiverSigned');
    return queryInterface.renameColumn('dibs_users', 'temp_signed_waiver', 'waiverSigned');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('dibs_users', 'temp_signed_waiver', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.sequelize.query(`UPDATE dibs_users SET temp_signed_waiver = true WHERE "waiverSigned" IS NOT NULL`)
    await queryInterface.removeColumn('dibs_users', 'waiverSigned');
    await queryInterface.renameColumn('dibs_users', 'temp_signed_waiver', 'waiverSigned');
  }
};
