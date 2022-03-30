'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('exceptions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      eventid: {
        type: Sequelize.INTEGER,
        references: {
          model: 'events',
          key: 'eventid'
        }
      },
      studioid: Sequelize.INTEGER,
      source: Sequelize.STRING(4),
      locationid: Sequelize.INTEGER,
      trainerid: Sequelize.INTEGER,
      day_of_week: Sequelize.INTEGER,
      name: Sequelize.STRING,
      time_of_day: Sequelize.STRING(4),
      new_min_price: Sequelize.INTEGER,
      new_max_price: Sequelize.INTEGER,
      fixed_price: Sequelize.INTEGER
    }).then(() =>
      queryInterface.addIndex('exceptions', ['source', 'studioid'], {unique: false})
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('exceptions', ['source', 'studioid']).then(() =>
      queryInterface.dropTable('exceptions'))
  }
};
