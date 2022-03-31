module.exports = function linkstudioAdminTileDatas(sequelize, DataTypes) {
  return sequelize.define('studio_admin_tile_datas', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    studioid: {
      type: DataTypes.INTEGER,
    },
    tableName: {
      type: DataTypes.STRING,
    },
    source: {
      type: DataTypes.STRING,
    },
    data: {
      type: DataTypes.JSONB,
    },
    locations: {
      type: DataTypes.INTEGER,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('NOW'),
    },
    updatedAt: DataTypes.DATE,
  }, {
    indexes: [
      {
        unique: true,
        fields: [
          'source',
          'studioid',
          'tableName',
          'locations',
        ],
      },
    ],
  });
};
