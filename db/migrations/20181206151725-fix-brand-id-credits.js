'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('credits', 'dibs_brand_id', { type: Sequelize.STRING });
    return queryInterface.addColumn('credits', 'dibs_brand_id', { type: Sequelize.INTEGER });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('credits', 'dibs_brand_id', { type: Sequelize.INTEGER });
    return queryInterface.addColumn('credits', 'dibs_brand_id', { type: Sequelize.STRING });
  },
};
