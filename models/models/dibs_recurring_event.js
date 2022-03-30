module.exports = function linkDibsRecurringEvent(sequelize, DataTypes) {
    /**
     * dibs_recurring_event
     * @prop {number} id primary key
     */
    return sequelize.define('dibs_recurring_event', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          dibs_studio_id: {
            type: DataTypes.INTEGER,
            references: {
              model: 'dibs_studios',
              key: 'id',
            },
          },
          dibs_location_id: {
              type: DataTypes.INTEGER,
              references: {
                model: 'dibs_studio_locations',
                key: 'id'
              },
            },
          dibs_room_id: {
              type: DataTypes.INTEGER,
          },
          start_as_of: {
            type: DataTypes.DATE,
          },
          day_of_week: {
            type: DataTypes.INTEGER,
          },
          time_of_day: {
            type: DataTypes.TIME,
          },
          end_time: {
            type: DataTypes.TIME,
          },
          name: {
            type: DataTypes.STRING,
          },
          length_of_event: {
            type: DataTypes.INTEGER,
          },
          default_trainer: {
              type: DataTypes.INTEGER,
              references: {
                model: 'dibs_studio_instructors',
                key: 'id'
              },
            },
          description: {
            type: DataTypes.TEXT,
            },
          default_price: {
            type: DataTypes.FLOAT,
            },
          default_seats: {
            type: DataTypes.INTEGER,
            },
          default_private: {
            type: DataTypes.BOOLEAN,
            },
          default_free: {
            type: DataTypes.BOOLEAN,
            },
          default_accepts_packages: {
            type: DataTypes.BOOLEAN,
            },
          is_recurring: {
            type: DataTypes.BOOLEAN,
            },
          createdAt: {
            type: DataTypes.DATE,
          },
          updatedAt: {
            type: DataTypes.DATE,
          },
          deletedAt: {
            type: DataTypes.DATE,
          },
        }, {
      paranoid: true,
    });
  };
