'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('flash_credit_schedules', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        userid: {
          type: Sequelize.INTEGER
        },
        dibs_studio_id: {
          type: Sequelize.INTEGER
        },
        interval_in_days: {
          type: Sequelize.INTEGER
        },
        day_of_week: {
          type: Sequelize.STRING
        },
        notify_by: {
          type: Sequelize.STRING
        },
        mobilephone: {
          type: Sequelize.STRING
        },
        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        },
        deletedAt: {
          type: Sequelize.DATE
        }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('flash_credit_schedules')
  }
};

