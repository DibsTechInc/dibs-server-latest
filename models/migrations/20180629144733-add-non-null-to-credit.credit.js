'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`UPDATE credits SET credit = 0 WHERE credit IS NULL`);
    return queryInterface.changeColumn('credits', 'credit', {
      type: Sequelize.FLOAT,
      defaultValue: 0,
      allowNull: false,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('credits', 'credit', {
      type: Sequelize.FLOAT,
      defaultValue: 0,
      allowNull: true,
    });
  }
};
