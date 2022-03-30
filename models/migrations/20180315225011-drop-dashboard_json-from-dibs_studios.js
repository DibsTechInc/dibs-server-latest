'use strict';

const defaultValue = '{"overview": {"totalRevenue": 0, "incrementalRevenue": 0, "returnOnInterest": 0}, "tileData": [{"value": 0, "previousValue": 0, "health": 0}, {"value": 0, "previousValue": 0, "health": 0}, {"value": 0, "previousValue": 0, "health": 0}, {"value": 0, "previousValue": 0, "health": 0}], "flashCredits": {"totalRevenue": 0, "creditsRedeemed": 0, "customerCategoryData": [{"customers": 0, "amountSpent": 0}, {"customers": 0, "amountSpent": 0}, {"customers": 0, "amountSpent": 0}]}}';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.removeColumn('dibs_studios', 'dashboard_json'),

  down: (queryInterface, Sequelize) => queryInterface.addColumn('dibs_studios', 'dashboard_json', {
    type: Sequelize.JSON,
    defaultValue,
  }),
};
