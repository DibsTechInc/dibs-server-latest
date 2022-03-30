module.exports = function linkContactForms(sequelize, DataTypes) {
  /**
   * contact_forms
   * @class contact_forms
   * @prop {number} id the attendee/visitid
   * @prop {number} email the studio id
   * @prop {number} name thhe class id
   */
  return sequelize.define('contact_forms', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    message: {
      type: DataTypes.STRING,
    },
    referredBy: {
      type: DataTypes.STRING,
    },
  }, {

  });
};
