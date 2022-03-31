module.exports = function linkStudioFeedback(sequelize, DataTypes) {
  /**
   * contact_forms
   * @class contact_forms
   * @prop {number} id the attendee/visitid
   * @prop {number} email the studio id
   * @prop {number} name thhe class id
   */
  return sequelize.define('studio_feedback', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userid: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_users',
        key: 'id',
      },
    },
    subject: DataTypes.TEXT,
    comments: DataTypes.TEXT,
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('NOW'),
    },
    updatedAt: DataTypes.DATE,
  }, {

  });
};
