module.exports = function linkPromoCodesUser(sequelize, DataTypes) {
  /**
   * promo_codes_user
   * @class promo_codes_user
   * @prop {number} id the id
   * @prop {number} userid the user id
   * @prop {number} promoid the promo id
   * @prop {number} studioid the studio id
   * @prop {string} source the source
   * @prop {DateTime} createdAt a time
   * @prop {DateTime} updatedAt a time
   * @prop {DateTime} deletedAt a time
   */
  return sequelize.define('promo_codes_user', {
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
    studioid: {
      type: DataTypes.INTEGER,
    },
    source: {
      type: DataTypes.STRING(4),
    },
    dibs_studio_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_studios',
        key: 'id',
      },
    },
    group_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'promo_code',
        key: 'group_id',
      },
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
