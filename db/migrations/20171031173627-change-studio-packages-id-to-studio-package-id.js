'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_user_autopay_packages', 'stripe_customer_id', Sequelize.STRING);
  },


  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_user_autopay_packages', 'stripe_customer_id');
  }
};
