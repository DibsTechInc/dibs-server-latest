'use strict';

'use strict';

const { default: replaceEnum } = require('sequelize-replace-enum-postgres');

const CREDIT_TRANSACTION_TYPES = {
  SMART_PASS_AWARD: 'smart_pass_award',
  CLASS_DROP: 'class_drop',
  CREDIT_LOAD: 'credit_load',
  REFER_A_FRIEND: 'refer_a_friend',
  COMP: 'comp',
  CREDIT_APPLICATION: 'credit_application',
  REFUND: 'refund',
  PROMO_CODE: 'promo_code',
};

module.exports = {
  up: (queryInterface, Sequelize) => {
    return replaceEnum({
      queryInterface,
      tableName: 'credit_transactions',
      columnName: 'type',
      defaultValue: null,
      allowNull: true,
      newValues: Object.values(CREDIT_TRANSACTION_TYPES),
      enumName: 'enum_credit_transactions_type',
    });
  },

  down: (queryInterface, Sequelize) => {
    return replaceEnum({
      queryInterface,
      tableName: 'credit_transactions',
      columnName: 'type',
      defaultValue: null,
      allowNull: true,
      newValues: Object.values(CREDIT_TRANSACTION_TYPES).filter(x => x !== 'promo_code'),
      enumName: 'enum_credit_transactions_type',
    });
  }
};
