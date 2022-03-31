module.exports = function linkSpecialNotifications(sequelize, DataTypes) {
  /**
   * sms_category
   *
   * @class sms_category
   * @prop {number} id primary key
   * @prop {number} studioid the studio id
   * @prop {string} source the studio source
   * @prop {string} message the text to display
   * @prop {datetime} showUntil the date to stop showing
   * @prop {boolean} showOnlyUsers whether the text applies only to users
   */
  const SpecialNotification = sequelize.define('special_notifications', {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    message: {
      type: DataTypes.TEXT,
    },
    showUntil: {
      type: DataTypes.DATE,
    },
    showFrom: {
      type: DataTypes.DATE,
    },
    showOnlyUsers: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('NOW'),
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
    dibs_studio_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_studios',
        key: 'id',
      },
    },
    widget_path: {
      type: DataTypes.STRING,
    },
  }, {
    paranoid: true,
    indexes: [{
      unique: false,
      fields: [
        'dibs_studio_id',
      ],
    }],
  });
  SpecialNotification.associate = function associate(models) {
    models.special_notifications.belongsTo(models.dibs_studio, {
      foreignKey: 'dibs_studio_id',
      targetKey: 'id',
      as: 'studio',
    });
  };
  return SpecialNotification;
};
