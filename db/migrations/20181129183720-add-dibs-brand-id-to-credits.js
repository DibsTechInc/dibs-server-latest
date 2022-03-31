'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('dibs_users', 'venmo_name', { type: Sequelize.STRING });
    return queryInterface.addColumn('credits', 'dibs_brand_id', { type: Sequelize.STRING });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('dibs_users', 'venmo_name', { type: Sequelize.STRING });
    return queryInterface.removeColumn('credits', 'dibs_brand_id', { type: Sequelize.STRING });
  },
};
