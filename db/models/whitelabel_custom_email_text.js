module.exports = function linkWhitelabelCustomEmailText(sequelize, DataTypes) {
  const WhitelabelCustomEmailText = sequelize.define('whitelabel_custom_email_text', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    template: DataTypes.STRING,
    text: DataTypes.TEXT,
    dibs_studio_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_studios',
        key: 'id',
      },
    },
    createdAt: {
      type: DataTypes.DATE(),
    },
    updatedAt: {
      type: DataTypes.DATE(),
    },
  }, {
    freezeTableName: true,
  });
  return WhitelabelCustomEmailText;
};
