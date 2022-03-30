'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface
      .renameColumn('exceptions', 'time_of_day', 'start_time')
      .then(() => queryInterface.addColumn('exceptions', 'end_time', { type: Sequelize.STRING(4) }))
      .then(() => queryInterface.sequelize.query('UPDATE exceptions SET end_time = start_time;'))
      .then(() => queryInterface.addColumn('exceptions', 'days_of_week', {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
      }))
      .then(() => queryInterface.sequelize.query(`
        UPDATE exceptions
        SET days_of_week = (
          CASE
            WHEN day_of_week IS NULL THEN NULL
            ELSE ARRAY[day_of_week]
          END
        );
      `))
      .then(() => queryInterface.removeColumn('exceptions', 'day_of_week'));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface
      .removeColumn('exceptions', 'end_time')
      .then(() => queryInterface.renameColumn('exceptions', 'start_time', 'time_of_day'))
      .then(() => queryInterface.addColumn('exceptions', 'day_of_week', { type: Sequelize.INTEGER }))
      .then(() => queryInterface.sequelize.query(`
        UPDATE exceptions
        SET day_of_week = (
          CASE
            WHEN days_of_week IS NULL THEN NULL
            ELSE days_of_week[0]
          END
        );
      `))
      .then(() => queryInterface.removeColumn('exceptions', 'days_of_week'));
  }
};
