module.exports = function defineDibsAPIUser(sequelize, DataTypes) {
  return sequelize.define('dibs_api_user', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    token: DataTypes.STRING,
    client_secret: DataTypes.STRING,
    client_id: DataTypes.STRING,
    callback_url: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
  }, {
    paranoid: true,
  });
};
