'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_studios', 'liveWidget', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    })
    .then(() =>
      queryInterface.sequelize.query(`
        UPDATE
          dibs_studios
        SET "liveWidget" = dibs_studios.live
      `)
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_studios', 'liveWidget', Sequelize.BOOLEAN)
  }
};
