'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('dibs_gift_cards', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      senderid: Sequelize.INTEGER,
      recipientid: Sequelize.INTEGER,
      transactionid: Sequelize.INTEGER,
      promoid: Sequelize.INTEGER,
      createdAt: Sequelize.DATE,
      updatedAt: { type: Sequelize.DATE, allowNull: true }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('dibs_gift_cards')
  }
};
