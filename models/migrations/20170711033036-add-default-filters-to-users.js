'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_users', 'defaultFilters', {
      type: Sequelize.JSONB,
      defaultValue: {
        city: undefined,
        studios: [],
        classNames: [],
        timeSpread: [],
        locationids: [],
        priceSpread: [],
        instructorids: [],
        durationSpread: [],
      },
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_users', 'defaultFilters');
  }
};
