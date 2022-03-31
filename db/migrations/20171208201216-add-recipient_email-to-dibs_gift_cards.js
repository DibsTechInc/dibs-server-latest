'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('dibs_gift_cards', 'recipient_email', {
      type: Sequelize.STRING,
      references: {
        model: 'dibs_users',
        key: 'email'
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('dibs_gift_cards', 'recipient_email');
  }
};
