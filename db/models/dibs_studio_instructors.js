module.exports = function linkDibsEffects(sequelize, DataTypes) {
  /**
   * contact_forms
   * @class contact_forms
   * @prop {number} id the attendee/visitid
   * @prop {number} email the studio id
   * @prop {number} name thhe class id
   */
  const DibsStudioInstructor = sequelize.define('dibs_studio_instructors', {
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
    source_instructor_id: DataTypes.STRING(30),
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING,
    enabled: DataTypes.BOOLEAN,
    dibs_studio_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_studio',
        key: 'id',
      },
    },
    image_url: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
    rate_per_class: DataTypes.FLOAT,
    rate_per_head: DataTypes.FLOAT,
    hurdle: DataTypes.INTEGER,
    bonus_flat: DataTypes.FLOAT,
    bonus_per_head: DataTypes.FLOAT,
    rev_share_perc: DataTypes.FLOAT,
    mobilephone: DataTypes.STRING,
  });

  DibsStudioInstructor.associate = function associate(models) {
    DibsStudioInstructor.belongsTo(models.dibs_studio, {
      foreignKey: 'dibs_studio_id',
      targetKey: 'id',
      as: 'instructors',
    });
  };
  return DibsStudioInstructor;
};
