module.exports = function linkDibsEffects(sequelize, DataTypes) {
  /**
   * contact_forms
   * @class contact_forms
   * @prop {number} id the attendee/visitid
   * @prop {number} email the studio id
   * @prop {number} name thhe class id
   */
  return sequelize.define('dibs_effects', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    totalLocations: {
      type: DataTypes.INTEGER,
    },
    spotsPerLocation: {
      type: DataTypes.INTEGER,
    },
    classesPerDay: {
      type: DataTypes.INTEGER,
    },
    avgFillRate: {
      type: DataTypes.FLOAT,
    },
    avgPricePaid: {
      type: DataTypes.FLOAT,
    },
  }, {

  });
};
