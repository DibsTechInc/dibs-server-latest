'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addIndex('studio_credit_special_tiers', ['source', 'studioid', 'payAmount'])
      .then(() => queryInterface.addIndex('studio_credit_special_tier_users', ['studio_credit_special_tiers_id', 'userid']));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('studio_credit_special_tiers', ['source', 'studioid', 'payAmount'])
      .then(() => queryInterface.removeIndex('studio_credit_special_tier_users', ['studio_credit_special_tiers_id', 'userid']));
  }
};
