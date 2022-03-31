'use strict';

module.exports = {
  up: async function (queryInterface, Sequelize) {
    await queryInterface.changeColumn('dibs_gift_cards', 'recipient_email', Sequelize.STRING);
    return queryInterface.sequelize.query(
      `ALTER TABLE dibs_gift_cards DROP CONSTRAINT IF EXISTS "dibs_gift_cards_recipient_email_fkey";
       ALTER TABLE dibs_gift_cards DROP CONSTRAINT IF EXISTS "recipient_email_foreign_idx";`
    );
  },

  down: async function (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TABLE dibs_gift_cards DROP CONSTRAINT IF EXISTS "dibs_gift_cards_recipient_email_fkey";
       ALTER TABLE dibs_gift_cards DROP CONSTRAINT IF EXISTS "recipient_email_foreign_idx";`
    );
    return queryInterface.changeColumn('dibs_gift_cards', 'recipient_email', {
      type: Sequelize.STRING,
      references: {
        model: 'dibs_users',
        key: 'email'
      },
    });
  }
};
