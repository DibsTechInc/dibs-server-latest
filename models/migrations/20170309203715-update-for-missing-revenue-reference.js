'use strict';
const models = require('../');

module.exports = {
  up: function (queryInterface, Sequelize) {
    models.mb_pseudo_client_services.findAll().then(pseudoServices => {
      pseudoServices.forEach(ps => {
        let revenueDefaults;

        if (serviceName.match(/classpass|class pass/i)) {
          revenueDefaults = {
            DibsCategory1: 'B',
            DibsCategory2: 'B2',
            avgRevenue: cpAmount || 16,
          };
        } else if (serviceName.match(membershipRegex)) {
          revenueDefaults = {
            DibsCategory1: 'A',
            DibsCategory2: 'A1',
            avgRevenue: 300,
          };
        } else if (serviceName.match(/dibs/i)) {
          revenueDefaults = {
            DibsCategory1: 'D',
            DibsCategory2: 'D',
            avgRevenue: null,
          };
        } else {
          revenueDefaults = {
            DibsCategory1: 'M',
            DibsCategory2: 'M',
            avgRevenue: price !== null ? new Decimal(price).dividedBy(count).toNumber() : 20,
          };
        }
        // only create new records, never modify old ones
        models.revenue_reference.findOrInitialize({
          where: { studioID: studioid, paymentCategory: serviceName, serviceID: serviceid },
          defaults: revenueDefaults,
        }).spread((record, created) => {
          if (created) return record.save();
          return null;
        }).catch((err) => {
          if (err.name !== 'SequelizeUniqueConstraintError' && err.name !== 'SequelizeValidationError') console.log(err);
        });
      })
    })
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
