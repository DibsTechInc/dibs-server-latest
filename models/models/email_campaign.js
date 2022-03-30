module.exports = function createEmailCampaign(sequelize, DataTypes) {
  const EmailCampaign = sequelize.define('email_campaign', {
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
    credit_campaign: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  EmailCampaign.associate = function associate(models) {
    EmailCampaign.belongsTo(models.dibs_user, {
      foreignKey: 'userid',
      targetKey: 'id',
      as: 'user',
    });
  };

  return EmailCampaign;
};
