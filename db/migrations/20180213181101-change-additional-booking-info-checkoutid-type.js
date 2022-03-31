'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all[
      queryInterface.removeColumn('dibs_additional_booking_info', 'checkoutId'),
      queryInterface.addColumn('dibs_additional_booking_info', 'checkoutUUID', { type: Sequelize.UUID })
    ]
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all[
      queryInterface.addColumn('dibs_additional_booking_info', 'checkoutId', Sequelize.INTEGER),
      queryInterface.removeColumn('dibs_additional_booking_info', 'checkoutUUID')
    ]
  }
};
