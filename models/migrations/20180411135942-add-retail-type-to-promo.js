'use strict';
const models = require('../');

const { default: replaceEnum } = require('sequelize-replace-enum-postgres');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return replaceEnum({
      queryInterface,
      tableName: 'promo_codes',
      columnName: 'product',
      defaultValue: models.promo_code.Products.CLASS,
      allowNull: false,
      newValues: ['UNIVERSAL',
        'CLASS',
        'PACKAGE',
        'RETAIL',
      ],
      enumName: 'enum_promo_codes_product',
    });
  },

  down: (queryInterface, Sequelize) => {
    return replaceEnum({
      queryInterface,
      tableName: 'promo_codes',
      columnName: 'product',
      defaultValue: models.promo_code.Products.CLASS,
      allowNull: false,
      newValues: ['UNIVERSAL',
        'CLASS',
        'PACKAGE',
      ],
      enumName: 'enum_promo_codes_product',
    });
  }
};
