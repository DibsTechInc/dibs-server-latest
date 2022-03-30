'use strict';

const { default: replaceEnum } = require('sequelize-replace-enum-postgres');

const promoCodeTypes = {
  CASH_OFF: 'CASH_OFF',
  FREE_CLASS: 'FREE_CLASS',
  PERCENT_OFF: 'PERCENT_OFF',
  GIFT_CARD: 'GIFT_CARD',
  ADD_CREDITS: 'ADD_CREDITS',
};

module.exports = {
  up: (queryInterface, Sequelize) => {
    return replaceEnum({
      queryInterface,
      tableName: 'promo_codes',
      columnName: 'type',
      defaultValue: promoCodeTypes.CASH_OFF,
      allowNull: true,
      newValues: [...Object.keys(promoCodeTypes), 'FIXED_PRICE'],
      enumName: 'enum_promo_codes_type',
    });
  },

  down: (queryInterface, Sequelize) => {

    return replaceEnum({
      queryInterface,
      tableName: 'promo_codes',
      columnName: 'type',
      defaultValue: 'CASH_OFF',
      allowNull: true,
      newValues: [...Object.keys(promoCodeTypes)],
      enumName: 'enum_promo_codes_type',
    });
  }
};
