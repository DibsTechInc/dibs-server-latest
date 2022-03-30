'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const updateAttr = attr => `UPDATE credits SET ${attr} = 0 WHERE ${attr} IS NULL`;
    await queryInterface.sequelize.query(updateAttr('credit'));
    await queryInterface.changeColumn('credits', 'credit', {
      type: Sequelize.FLOAT,
      defaultValue: 0,
      allowNull: false,
    });
    return null;
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('credits', 'credit', {
      type: Sequelize.FLOAT,
      defaultValue: null,
      allowNull: true,
    });
    return null;
  },
};
