'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_transactions', 'promoid', {
      type: Sequelize.INTEGER,
      references: {
        model: 'promo_codes',
        key: 'id'
      },
      required: false,
      allowNull: true
    })
    .then(() => queryInterface.addColumn('dibs_transactions', 'flash_credit_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'flash_credits',
        key: 'id'
      },
      required: false,
      allowNull: true
    }))
    .then(() => queryInterface.addColumn('dibs_transactions', 'original_price', Sequelize.FLOAT))
    .then(() => queryInterface.addColumn('dibs_transactions', 'tax_amount', Sequelize.FLOAT))
    .then(() => queryInterface.changeColumn('dibs_transactions', 'amount', {type: Sequelize.FLOAT}))
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_transactions', 'promoid')
    .then(() => queryInterface.removeColumn('dibs_transactions', 'flash_credit_id'))
    .then(() => queryInterface.removeColumn('dibs_transactions', 'original_price'))
    .then(() => queryInterface.removeColumn('dibs_transactions', 'tax_amount'))
    .then(() => queryInterface.changeColumn('dibs_transactions', 'amount', {type: Sequelize.INTEGER}))

  }
};
