'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('promo_codes_users', 'dibs_studio_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'dibs_studios',
        key: 'id'
      },
    });
    return queryInterface.sequelize.query('UPDATE promo_codes_users SET dibs_studio_id = (SELECT id FROM dibs_studios WHERE dibs_studios.source = promo_codes_users.source AND dibs_studios.studioid = promo_codes_users.studioid);');
  },

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('promo_codes_users', 'dibs_studio_id'),
};
