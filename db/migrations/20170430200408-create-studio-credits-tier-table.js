'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_studios', 'defaultCreditTiers', {
      type: Sequelize.JSONB,
      defaultValue: [{
        payAmount: 50,
        receiveAmount: 55,
      },
      {
        payAmount: 100,
        receiveAmount: 110,
      },
      {
        payAmount: 150,
        receiveAmount: 165,
      }],
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_studios', 'defaultCreditTiers', {
      type: Sequelize.JSONB,
      defaultValue: [{
        payAmount: 50,
        receiveAmount: 55,
      },
      {
        payAmount: 100,
        receiveAmount: 110,
      },
      {
        payAmount: 150,
        receiveAmount: 165,
      }],
    })
  }
};
