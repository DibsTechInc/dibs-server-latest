'use strict';
const models = require('../');
const Promise = require('bluebird')

const NEW_PROMO_CODE_TYPES = {
  CASH_OFF: 'CASH_OFF',
  FREE_CLASS: 'FREE_CLASS',
  PERCENT_OFF: 'PERCENT_OFF',
  GIFT_CARD: 'GIFT_CARD',
  ADD_CREDITS: 'ADD_CREDITS',
}

const OLD_PROMO_CODE_TYPES = {
  CASH_OFF: 'co',
  FREE_CLASS: 'fc',
  PERCENT_OFF: 'po',
  GIFT_CARD: 'gc',
  ADD_CREDITS: 'ac',
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return models.sequelize.transaction( async (transaction) => {
      await queryInterface.changeColumn('promo_codes', 'type', Sequelize.STRING);
      await Promise.map(Object.keys(NEW_PROMO_CODE_TYPES), key => {
        return models.promo_code.update({ type: NEW_PROMO_CODE_TYPES[key] }, { where: { type: OLD_PROMO_CODE_TYPES[key] }, paranoid: false });
      })
      await queryInterface.changeColumn('promo_codes', 'type', {
        type: Sequelize.ENUM,
        values: Object.keys(NEW_PROMO_CODE_TYPES).map(key => NEW_PROMO_CODE_TYPES[key]),
      })
    })
  },

  down: (queryInterface, Sequelize) => {
    return models.sequelize.transaction(async (transaction) => {
      await queryInterface.changeColumn('promo_codes', 'type', Sequelize.STRING);
      await Promise.map(Object.keys(OLD_PROMO_CODE_TYPES), key => {
        return models.promo_code.update({ type: OLD_PROMO_CODE_TYPES[key] }, { where: { type: NEW_PROMO_CODE_TYPES[key] }, paranoid: false });
      })
      await queryInterface.changeColumn('promo_codes', 'type', Sequelize.STRING(3));
    })
  }
};
