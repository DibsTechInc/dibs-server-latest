'use strict';
const models = require('../');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('promo_codes', 'product', {
      type: Sequelize.ENUM,
      values: ['CLASS', 'PACKAGE', 'UNIVERSAL'],
      defaultValue: models.promo_code.Products.CLASS,
    })
    await queryInterface.sequelize.query(`UPDATE promo_codes SET product = '${models.promo_code.Products.CLASS}' WHERE product IS null`)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('promo_codes', 'product')
  }
};
