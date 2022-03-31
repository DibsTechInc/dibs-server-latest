'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('studio_pricings', 'dibs_studio_id', {
      type: Sequelize.INTEGER,
      unique: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('ALTER TABLE studio_pricings DROP CONSTRAINT IF EXISTS dibs_studio_id_unique_idx;');
    return queryInterface.changeColumn('studio_pricings', 'dibs_studio_id', {
      type: Sequelize.INTEGER,
      unique: false
    });
  }
};
