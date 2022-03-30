module.exports = function linkCreditPromoUser(sequelize, DataTypes) {
  /**
   * credit_promo_user
   *
   * @prop {number} id primary key
   * @prop {number} userid relates to id of dibs_users
   * @prop {number} promoid relates to id of credit_promo_codes
   * @prop {string} source
   * @prop {number} studioid
   */
  return sequelize.define('credit_promo_user', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userid: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_users',
        key: 'id',
      },
    },
    promoid: {
      type: DataTypes.INTEGER,
      references: {
        model: 'promo_codes',
        key: 'id',
      },
    },
    source: DataTypes.STRING(4),
    studioid: DataTypes.INTEGER,
  });
};
