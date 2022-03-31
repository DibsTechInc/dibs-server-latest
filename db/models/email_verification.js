module.exports = function linkEmailVerification(sequelize, DataTypes) {
  /**
   * email_verification
   *
   * @class email_verification
   * @prop {string} uuidParam the uuidParam
   * @prop {number} userid the user's ID
   * @prop {string} user_mobilephone the user's phone number
   * @prop {string} user_country the country the user is in
   * @prop {string} flow_responsepath response path for FlowXO to set user attributes
   * @prop {date} createdAt
   * @prop {date} updatedAt
   */
  return sequelize.define('email_verification', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    uuidParam: DataTypes.UUID,
    userid: DataTypes.INTEGER,
    user_mobilephone: DataTypes.TEXT,
    user_country: DataTypes.STRING(2),
    flow_responsepath: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
    updatedAt: { type: DataTypes.DATE, allowNull: true },
    deletedAt: { type: DataTypes.DATE, allowNull: true },
  }, {
    paranoid: true,
  });
};
