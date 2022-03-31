module.exports = function linkDibsUserStudio(sequelize, DataTypes) {
  /**
   * dibs_user_studio
   *
   * @class dibs_user_studio
   * @prop {number} userid the user id
   * @prop {number} studioid the studio id
   * @prop {string} clientid the client id
   * @prop {string} source the studio source
   * @prop {boolean} showed_vax_proof the client showed proof of covid vaccination
   */
  const UserStudio = sequelize.define('dibs_user_studio', {
    userid: {
      type: DataTypes.INTEGER,
    },
    studioid: {
      type: DataTypes.INTEGER,
    },
    clientid: {
      type: DataTypes.TEXT,
    },
    source: {
      type: DataTypes.STRING,
    },
    signed_waiver: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    dibs_studio_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_studios',
        key: 'id',
      },
    },
    has_attended: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    showed_vax_proof: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    vax_recorded_date: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    created_by_employeeid: {
      type: DataTypes.INTEGER,
      references: {
        model: 'studio_employees',
        key: 'id',
      },
    },
    stripe_customer_id: {
      type: DataTypes.STRING,
    },
    cardid_this_studio: {
      type: DataTypes.STRING,
    },
    zf_activated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    client_notes: {
      type: DataTypes.TEXT,
    },
    raf_amount: {
      type: DataTypes.INTEGER,
    },
    push_token: {
      type: DataTypes.STRING,
    },
    dibs_portal_userid: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_portal_users',
        key: 'id',
      },
    },
  });
  UserStudio.associate = function associate(models) {
    UserStudio.belongsTo(models.dibs_user, { foreignKey: 'userid', as: 'user' });
    UserStudio.belongsTo(models.dibs_studio, { foreignKey: 'dibs_studio_id', as: 'studio' });
    UserStudio.hasMany(models.duplicate_user, {
      as: 'duplicateUsers',
      foreignKey: 'dibs_user_studio_id',
    });
    UserStudio.belongsTo(models.dibs_portal_user, { foreignKey: 'dibs_portal_userid', as: 'dibs_portal_user' });
  };
  return UserStudio;
};

