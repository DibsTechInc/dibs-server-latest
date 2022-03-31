module.exports = function linkSmsPhrase(sequelize, DataTypes) {
  /**
   * sms_category
   *
   * @class sms_category
   * @prop {number} id primary key
   * @prop {number} categoryid relation to the group the phrase belongs to
   * @prop {string} phrase the phrase
   */
  const SMSPhrase = sequelize.define('sms_phrase', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    categoryid: {
      type: DataTypes.INTEGER,
    },
    phrase: {
      type: DataTypes.TEXT,
      unique: true,
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
  SMSPhrase.prototype.getClientJSON = function getClientJSON() {
    const { id, categoryid, phrase } = this;
    return { id, categoryid, phrase };
  };
  return SMSPhrase;
};
