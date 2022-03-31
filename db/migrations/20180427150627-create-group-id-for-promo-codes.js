'use strict';
const models = require('../index');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn('promo_codes', 'group_id', {
        type: Sequelize.INTEGER,
        autoIncrement: true,
      }, { transaction })
      await models.promo_code.update({ group_id: models.sequelize.literal('promo_codes.id') }, { where: {}, transaction })
      await queryInterface.addColumn('promo_codes_users', 'group_id', {
        type: Sequelize.INTEGER,
      }, { transaction })
      await models.promo_codes_user.update({ group_id: models.sequelize.literal('promo_codes_users.promoid') }, { where: {}, transaction })
      return queryInterface.sequelize.query("SELECT setval('promo_codes_group_id_seq', (SELECT MAX(group_id) from promo_codes) + 10000)", { transaction })
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('promo_codes', 'group_id');
    return queryInterface.removeColumn('promo_codes_users', 'group_id');
  }
};
