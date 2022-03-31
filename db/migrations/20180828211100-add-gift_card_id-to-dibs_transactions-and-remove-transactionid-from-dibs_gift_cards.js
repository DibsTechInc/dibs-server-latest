'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('dibs_transactions', 'gift_card_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'dibs_gift_cards',
        key: 'id',
      },
    });
    await queryInterface.sequelize.query(
      'UPDATE dibs_transactions SET gift_card_id = dibs_gift_cards.id FROM dibs_gift_cards WHERE dibs_gift_cards.transactionid = dibs_transactions.id');
    return queryInterface.removeColumn('dibs_gift_cards', 'transactionid');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('dibs_gift_cards', 'transactionid', {
      type: Sequelize.INTEGER,
      references: {
        model: 'dibs_transactions',
        key: 'id',
      },
    });
    await queryInterface.sequelize.query(
      'UPDATE dibs_gift_cards SET transactionid = dibs_transactions.id FROM dibs_transactions WHERE dibs_transactions.gift_card_id = dibs_gift_cards.id');
    return queryInterface.removeColumn('dibs_transactions', 'gift_card_id');
  }
};
