module.exports = function linkFavorites(sequelize, DataTypes) {
  /**
   * favorite
   *
   * @class favorite
   * @prop {number} id
   * @prop {number} userid
   * @prop {number} studioid
   * @prop {string} source
   * @prop {string} courseName
   * @prop {number} instructorid
   */
  const Favorite = sequelize.define('favorite', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userid: {
      type: DataTypes.INTEGER,
    },
    studioid: {
      type: DataTypes.INTEGER,
    },
    source: {
      type: DataTypes.STRING,
    },
    courseName: {
      type: DataTypes.STRING,
    },
    // The following value is stored as a string because Postgres will not allow
    // me to set an integer to NULL
    instructorid: {
      type: DataTypes.STRING,
    },
  });
/**
     * Upper cases the code
     * @memberof favorite
     * @static
     * @param {number} userid         the user id
     * @param {string} successMessage the message
     * @param {string} failureMessage the message
     * @param {function} callback       Description
     *
     * @returns {function} callback function
     */
  Favorite.getUserFavorites = function getUserFavorites(userid, successMessage, failureMessage, callback) {
    return this.findAll({ where: { userid } })
      .then(favorites => callback(apiSuccessWrapper({ favorites }, successMessage)))
      .catch(error => callback(apiFailureWrapper({ error }, failureMessage)));
  };
  return Favorite;
};
