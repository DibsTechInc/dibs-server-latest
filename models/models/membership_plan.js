module.exports = function linkMembershipPlan(sequelize, DataTypes) {
  /**
   * membership_plan
   *
   * @class membership_plan
   * @prop {string} stripeid a UUID
   * @prop {string} name thh name
   * @prop {number} studioid the studio id
   * @prop {string} source the studio source
   * @prop {string} interval the interval
   * @prop {number} interval_count the count
   * @prop {number} price the price
   */
  return sequelize.define('membership_plan', {
    stripeid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
    },
    name: DataTypes.STRING,
    studioid: DataTypes.INTEGER,
    source: DataTypes.STRING(4),
    interval: DataTypes.STRING(5),
    interval_count: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
  }, {
    paranoid: true,
  });
};
