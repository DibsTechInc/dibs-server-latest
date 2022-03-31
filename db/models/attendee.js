module.exports = function linkAttendees(sequelize, DataTypes) {
  /**
   * attendees
   * @class attendees
   * @prop {number} attendeeID the attendee/visitid
   * @prop {number} studioID the studio id
   * @prop {number} classID thhe class id
   * @prop {number} clientID the client id
   * @prop {string} email the user email
   * @prop {number} serviceID the sale service id
   * @prop {string} serviceName the sale service name
   * @prop {number} revenue the revenue earned
   * @prop {string} firstname the attendee first name
   * @prop {string} lastname the attendee last name
   * @prop {boolean} [checkedin=false] whether the attendee is checked
   */
  const Attendee = sequelize.define('attendees', {
    attendeeID: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    source: {
      type: DataTypes.STRING,
    },
    studioID: {
      type: DataTypes.INTEGER,
    },
    classID: {
      type: DataTypes.STRING(30),
    },
    clientID: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    serviceID: {
      type: DataTypes.STRING(30),
    },
    serviceName: {
      type: DataTypes.STRING,
    },
    revenue: {
      type: DataTypes.FLOAT,
    },
    firstname: {
      type: DataTypes.STRING,
    },
    lastname: {
      type: DataTypes.STRING,
    },
    checkedin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    cost: {
      type: DataTypes.FLOAT,
    },
    dropped: {
      type: DataTypes.BOOLEAN,
    },
    dibs_studio_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_studios',
        key: 'id',
      },
    },
    source_serviceid: {
      type: DataTypes.STRING,
    },
    userid: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_user',
        key: 'id',
      },
    },
    eventid: {
      type: DataTypes.INTEGER,
      references: {
        model: 'event',
        key: 'eventid',
      },
    },
    visitDate: {
      type: DataTypes.DATE,
    },
    early_cancel: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  });

  Attendee.associate = function associate(models) {
    Attendee.belongsTo(models.dibs_studio, {
      foreignKey: 'dibs_studio_id',
      targetKey: 'id',
      as: 'studio',
    });
    Attendee.belongsTo(models.dibs_user, {
      foreignKey: 'userid',
      targetKey: 'id',
      as: 'user',
    });
  };

  Attendee.fullTextSearch = async function fullTextSearch(str, { where = {}, limit = '' } = {}) {
    const additionalWhere = Object.keys(where).reduce((acc, key) =>
      `${acc} AND "${key}" = ${where[key]}`
    , '');
    return this.sequelize.query(`
      SELECT *, ts_rank_cd(ft_search, to_tsquery('${str}:*')) as rank FROM attendees WHERE to_tsquery('${str}:*') @@ ft_search ${additionalWhere}
      ORDER BY rank DESC
      ${limit && `LIMIT ${limit}`}
      ;
    `, {
      type: this.sequelize.QueryTypes.SELECT,
      model: this,
    });
  };
  return Attendee;
};
