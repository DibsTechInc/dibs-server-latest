'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('membership_stats', 'total_stripe_fees', {
          type: Sequelize.DataTypes.FLOAT,
        }, { transaction: t }),
        queryInterface.addColumn('membership_stats', 'total_tax', {
          type: Sequelize.DataTypes.FLOAT,
        }, { transaction: t }),
        queryInterface.addColumn('membership_stats', 'total_net_rev', {
          type: Sequelize.DataTypes.FLOAT,
        }, { transaction: t }),
        queryInterface.addColumn('membership_stats', 'avg_tax_per_visit', {
          type: Sequelize.DataTypes.FLOAT,
        }, { transaction: t }),
        queryInterface.addColumn('membership_stats', 'avg_stripe_fee_per_visit', {
          type: Sequelize.DataTypes.FLOAT,
        }, { transaction: t }),
        queryInterface.addColumn('membership_stats', 'net_rev_per_visit', {
          type: Sequelize.DataTypes.FLOAT,
        }, { transaction: t }),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('membership_stats', 'total_stripe_fees', { transaction: t }),
        queryInterface.removeColumn('membership_stats', 'total_tax', { transaction: t }),
        queryInterface.removeColumn('membership_stats', 'total_net_rev', { transaction: t }),
        queryInterface.removeColumn('membership_stats', 'avg_tax_per_visit', { transaction: t }),
        queryInterface.removeColumn('membership_stats', 'avg_stripe_fee_per_visit', { transaction: t }),
        queryInterface.removeColumn('membership_stats', 'net_rev_per_visit', { transaction: t }),
      ]);
    });
  }
};