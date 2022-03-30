'use strict';

const CREDIT_TRANSACTION_TYPES = {
  SMART_PASS_AWARD: 'smart_pass_award',
  CLASS_DROP: 'class_drop',
  CREDIT_LOAD: 'credit_load',
  REFER_A_FRIEND: 'refer_a_friend',
  COMP: 'comp',
  CREDIT_APPLICATION: 'credit_application',
};

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('credit_transactions', 'type', {
      type: Sequelize.ENUM,
      values: Object.values(CREDIT_TRANSACTION_TYPES),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('credit_transactions', 'type');
    return queryInterface.sequelize.query('DROP TYPE enum_credit_transactions_type');
  }
};
