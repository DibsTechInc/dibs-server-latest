module.exports = function linkSmsCategory(sequelize, DataTypes) {
  /**
   * sms_category
   *
   * @class sms_category
   * @prop {number} id primary key
   * @prop {string} category
   * @prop {Array.<String>} responses - array of response texts for Flow
   * @prop {Number} priority when there are multiple matches
   */
  const SMSCategory = sequelize.define('sms_category', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category: {
      type: DataTypes.TEXT,
      unique: true,
    },
    responses: {
      type: DataTypes.JSONB,
    },
    priority: {
      type: DataTypes.INTEGER,
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
  });

  SMSCategory.prototype.getClientJSON = function getClientJSON() {
    const { id, category, responses } = this;
    return { id, category, responses };
  };
  return SMSCategory;
};
