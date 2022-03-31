module.exports = function linkDibsEffects(sequelize, DataTypes) {
  /**
   * contact_forms
   * @class contact_forms
   * @prop {number} id the attendee/visitid
   * @prop {number} email the studio id
   * @prop {number} name thhe class id
   */
  const DibsStudioLocation = sequelize.define('dibs_studio_locations', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    studioid: {
      type: DataTypes.INTEGER,
    },
    source: {
      type: DataTypes.STRING(4),
    },
    region_id: DataTypes.STRING(30),
    source_location_id: DataTypes.STRING(30),
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    address2: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zipcode: DataTypes.STRING,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    tax_rate: DataTypes.FLOAT,
    visible: DataTypes.BOOLEAN,
    short_name: DataTypes.STRING,
    dibs_studio_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_studios',
        key: 'id',
      },
    },
    retail_tax_rate: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    customer_service_email: DataTypes.STRING,
    customer_service_phone: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  });
  DibsStudioLocation.associate = function associate(models) {
    DibsStudioLocation.belongsTo(models.dibs_studio, {
      foreignKey: 'dibs_studio_id',
      targetKey: 'id',
      as: 'locations',
    });
  };
  return DibsStudioLocation;
};
