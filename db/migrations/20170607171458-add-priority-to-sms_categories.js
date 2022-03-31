'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('sms_categories', 'priority', {
      type: Sequelize.INTEGER,
    })
    .then(() => queryInterface.sequelize.query(`
      UPDATE sms_categories SET priority = 0 WHERE category = 'sick';
      UPDATE sms_categories SET priority = 1 WHERE category = 'drop';
      UPDATE sms_categories SET priority = 2 WHERE category = 'book';
      UPDATE sms_categories SET priority = 3 WHERE category = 'notify me';
      UPDATE sms_categories SET priority = 4 WHERE category = 'greeting';
      UPDATE sms_categories SET priority = 5 WHERE category = 'thank';
    `));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('sms_categories', 'priority');
  }
};
