module.exports = function linkReceipt(sequelize, DataTypes) {
    /**
     * on_demand_events
     * @prop {number} id primary key
     * @prop {number} eventid of the class
     * @prop {string} email of the user
     * @prop {number} userid where available
     */
  const onDemandEvents = sequelize.define('on_demand_events', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dibs_studio_id: {
      type: DataTypes.INTEGER,
    },
    title: {
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.STRING,
    },
    trainerid: {
      type: DataTypes.INTEGER,
    },
    trainer_name: {
      type: DataTypes.STRING,
    },
    short_description: {
      type: DataTypes.STRING,
    },
    long_description: {
      type: DataTypes.STRING,
    },
    length: {
      type: DataTypes.INTEGER,
    },
    intensity: {
      type: DataTypes.INTEGER,
    },
    price: {
      type: DataTypes.FLOAT,
    },
    category: {
      type: DataTypes.STRING,
    },
    show_video: {
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
    equipment: {
      type: DataTypes.STRING,
    },
    thumbnail_url: {
      type: DataTypes.STRING,
    },
    dateRecorded: {
      type: DataTypes.DATE,
    },
  }, {});
  return onDemandEvents;
};
