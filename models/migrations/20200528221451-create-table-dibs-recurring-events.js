'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('dibs_recurring_events', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      dibs_studio_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'dibs_studios',
          key: 'id'
        },
      },
      day_of_week: Sequelize.DataTypes.INTEGER,
      time_of_day: Sequelize.DataTypes.TIME,
      length_of_event: Sequelize.DataTypes.INTEGER,
      default_trainer: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'dibs_studio_instructors',
          key: 'id'
        },
      },
      description: Sequelize.DataTypes.TEXT,
      default_price: Sequelize.DataTypes.FLOAT,
      default_seats: Sequelize.DataTypes.INTEGER,
      default_private: Sequelize.DataTypes.BOOLEAN,
      default_free: Sequelize.DataTypes.BOOLEAN,
      default_accepts_packages: Sequelize.DataTypes.BOOLEAN,
      dibs_location_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'dibs_studio_locations',
          key: 'id'
        },
      },
      dibs_room_id: Sequelize.DataTypes.INTEGER,
      start_as_of: Sequelize.DataTypes.DATE,
      createdAt: {
        type: Sequelize.DataTypes.DATE,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
      },
      deletedAt: {
        type: Sequelize.DataTypes.DATE,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('dibs_recurring_events');
  }
};
