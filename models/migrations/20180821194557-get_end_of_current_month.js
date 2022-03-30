'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createFunction(
      'get_current_end_of_month',
      [],
      'timestamp',
      'plpgsql',
      "return date_trunc('month', now()) + interval '1 month' - interval '1 second';"
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropFunction('get_current_end_of_month', [])
  }
};
