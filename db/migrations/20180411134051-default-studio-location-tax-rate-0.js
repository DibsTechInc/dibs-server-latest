'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const updateAttr = attr => `UPDATE dibs_studio_locations SET ${attr} = 0 WHERE ${attr} IS NULL`;
    await queryInterface.sequelize.query(updateAttr('tax_rate'));
    await queryInterface.changeColumn('dibs_studio_locations', 'tax_rate', {
      type: Sequelize.FLOAT,
      defaultValue: 0,
      allowNull: false,
    });
    return null;
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('dibs_studio_locations', 'tax_rate', {
      type: Sequelize.FLOAT,
      defaultValue: null,
      allowNull: true,
    });
    return null;
  },
};
