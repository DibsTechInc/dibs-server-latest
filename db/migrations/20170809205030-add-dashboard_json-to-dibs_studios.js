'use strict';

const defaultValue = '{"overview": {"totalRevenue": 0, "incrementalRevenue": 0, "returnOnInterest": 0}, "tileData": [{"value": 0, "previousValue": 0, "health": 0}, {"value": 0, "previousValue": 0, "health": 0}, {"value": 0, "previousValue": 0, "health": 0}, {"value": 0, "previousValue": 0, "health": 0}], "flashCredits": {"totalRevenue": 0, "creditsRedeemed": 0, "customerCategoryData": [{"customers": 0, "amountSpent": 0}, {"customers": 0, "amountSpent": 0}, {"customers": 0, "amountSpent": 0}]}}';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_studios', 'dashboard_json', {
      type: Sequelize.JSON,
      defaultValue,
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_studios', 'dashboard_json');
  }
};
