'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_studios', 'widgetReferAFriend', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    })
    .then(() => queryInterface.sequelize.query(`
      UPDATE dibs_studios
      SET "widgetReferAFriend" = false
      WHERE id = 19;
    `));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_studios', 'widgetReferAFriend');
  }
};
