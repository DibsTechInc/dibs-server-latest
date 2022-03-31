module.exports = function linkStudioExceptions(sequelize, DataTypes) {
  /**
   * Exceptions
   *
   * @class Exceptions
   * @prop {number} id the id
   * @prop {number} eventid the event id
   * @prop {number} studioid the studio's source studioid
   * @prop {string} source the the source
   * @prop {number} locationid the locationid
   * @prop {number} trainerid the trainerid
   * @prop {number} day_of_week the day of week
   * @prop {number} name the name
   * @prop {number} time_of_day the time of day
   * @prop {number} new_min_price the new min price
   * @prop {number} new_max_price the new max price
   * @prop {number} fixed_price the new fixed price
   * @prop {number} dibs_studio_id Dibs studio id
   * @prop {number} dibsclassid Dibs class id from dibs_recurring_events (if relevant)
   * @prop {boolean} edited if true it means this exception was deleted and replaced with an edited version
   * @prop {number} employeeid of the studio employee creating the exception
   */
  const Exceptions = sequelize.define('exceptions', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    eventid: {
      type: DataTypes.INTEGER,
    },
    studioid: {
      type: DataTypes.INTEGER,
    },
    source: {
      type: DataTypes.STRING,
    },
    locationid: {
      type: DataTypes.INTEGER,
    },
    trainerid: {
      type: DataTypes.INTEGER,
    },
    days_of_week: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    start_time: {
      type: DataTypes.STRING(4),
    },
    end_time: {
      type: DataTypes.STRING(4),
    },
    new_min_price: {
      type: DataTypes.INTEGER,
    },
    new_max_price: {
      type: DataTypes.INTEGER,
    },
    fixed_price: {
      type: DataTypes.INTEGER,
    },
    dibs_studio_id: {
      type: DataTypes.INTEGER,
    },
    dibsclassid: {
      type: DataTypes.INTEGER,
    },
    edited: {
      type: DataTypes.BOOLEAN,
    },
    employeeid: {
      type: DataTypes.INTEGER,
    },
    to_date: {
      type: DataTypes.DATE,
    },
    from_date: {
      type: DataTypes.DATE,
    },
    studio_admin_visible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    paranoid: true,
  });
  Exceptions.associate = function associate(models) {
    Exceptions.belongsTo(models.dibs_studio_instructors, {
      foreignKey: 'trainerid',
      targetKey: 'id',
      as: 'instructor',
    });
    Exceptions.belongsTo(models.dibs_studio_locations, {
      foreignKey: 'locationid',
      targetKey: 'id',
      as: 'location',
    });
  };
  return Exceptions;
};
