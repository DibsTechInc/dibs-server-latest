'use strict';
const models = require('../');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await models.passes.update({ passValue: 0}, { where: { passValue: null }})
    await queryInterface.changeColumn('passes', 'passValue', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0,
    });
    return null;
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('passes', 'passValue', {
      type: Sequelize.FLOAT,
      allowNull: true,
      defaultValue: null,
    });
    return null;
  }
};
