'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('dibs_user_studios', 'custom_raf_referrer_amount', {
      type: Sequelize.FLOAT,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('dibs_user_studios', 'custom_raf_referrer_amount');
  }
};
