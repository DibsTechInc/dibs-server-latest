module.exports = function linkShortCode(sequelize, DataTypes) {
  /**
   * short_code
   * @prop {number} id primary key
   * @prop {integer} userid user for short code
   */
  return sequelize.define('short_code', {
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
    dibs_portal_userid: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_portal_users',
        key: 'id',
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
    generated_at: DataTypes.DATE,
  }, {});
};
