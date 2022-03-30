'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.removeColumn('dibs_user_studios', 'custom_raf_referrer_amount').then(() =>
      queryInterface.addColumn('dibs_user_studios', 'raf_amount', { type: Sequelize.INTEGER })),

  down: (queryInterface, Sequelize) =>
    queryInterface.removeColumn('dibs_user_studios', 'raf_amount').then(() =>
      queryInterface.addColumn('dibs_user_studios', 'custom_raf_referrer_amount', { type: Sequelize.FLOAT })),
};
