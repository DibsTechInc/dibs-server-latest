const { times, groupBy } = require('lodash');

/**
 * @param {Array<object>} Array of spot objects
 * @returns {number} largest X coordinate
 */
function largestX(arr) {
  return arr.reduce((largest, cVal) => (cVal.x > largest ? cVal.x : largest), 0);
}
/**
 * @param {number} length of X dimension of array
 * @returns {Array<array>} empty multi-dimensional array
 */
function constructMDArr(length) {
  const arr = [];
  times(length + 1, () => arr.push([]));
  return arr;
}
/**
 *
 * @param {object} room room instance
 * @returns {object} updated instance
 */
async function retrieveSpots(room) {
  if (room.spots) return room;
  room.spots = await room.getSpots({ order: [['id', 'ASC']] });
  return room;
}

/**
 * @param {Array<object>} Array of spot objects
 * @returns {Array<array>} Multidimensional representation of spot objects
 */
function arrayify(objArr) {
  return objArr.reduce((acc, val) => {
    acc[val.x][val.y] = val;
    return acc;
  }, constructMDArr(largestX(objArr)))
}

module.exports = function (sequelize, DataTypes) {
  const Room = sequelize.define('room', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    dibs_studio_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_studio',
        as: 'studio',
      },
    },
    source_roomid: DataTypes.STRING,
    source_image_url: DataTypes.STRING,
    location_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_studio_locations',
        as: 'location',
      },
    },
    custom_room_url: DataTypes.STRING,
  }, {
    paranoid: true,
    getterMethods: {
      availableSpots() {
        return this.spots.filter(spot => spot.available);
      },
      spotGrid() {
        if (!this.spots) return [];
        return arrayify(this.spots);
      },
      idMappedSpots() {
        if (!this.spots) return [];
        return this.spots.reduce((acc, val) => {
          acc[val.id] = val;
          return acc;
        }, {});
      },
      sourceIdMappedSpots() {
        if (!this.spots) return [];
        return this.spots.reduce((acc, val) => {
          acc[val.source_id] = val;
          return acc;
        }, {});
      },
    },
    hooks: {
      afterFind(instance) {
        if (Array.isArray(instance)) return Promise.map(instance, retrieveSpots);
        return retrieveSpots(instance);
      },
    },
  });

  Room.associate = function associate(models) {
    Room.belongsTo(models.dibs_studio, {
      foreignKey: 'dibs_studio_id',
      as: 'studio',
    });
    Room.belongsTo(models.dibs_studio_locations, {
      foreignKey: 'location_id',
      as: 'location',
    });
    Room.hasMany(models.spot, {
      foreignKey: 'room_id',
    });
  };

  Room.findRoomAsForEvent = async function findRoomAsForEvent(eventid, { useTransactions = true } = {}) {
    const { room_id } = await this.sequelize.models.event.findById(eventid, { attributes: ['room_id'] });
    const includeData = [
      {
        model: this.sequelize.models.dibs_user,
        as: 'user',
      },
    ];
    const sourceModel = useTransactions ?
      await this.sequelize.models.dibs_transaction.findAll({
        where: { eventid },
        include: includeData,
      }) :
      await this.sequelize.models.attendees.findAll({
        where: { eventid, dropped: false },
        include: includeData,
      });
    const room = await this.findById(room_id);
    const sourceModelBySpot = groupBy(sourceModel, 'spot_id');
    room.spots.forEach((spot) => {
      spot.user = (sourceModelBySpot[spot.id] && sourceModelBySpot[spot.id].user) || null;
      spot.available = !sourceModelBySpot[spot.id];
    });
    return room;
  };

  /**
   * @param {Array<string>} availableSpots list of spot ids
   * @param {object} options optional paramters
   * @param {boolean} options.useSourceId which id to use when creating a spot map
   * @returns {object} instance
   */
  Room.prototype.mapExternalAvailableSpots = function mapExternalAvailableSpots(availableSpots, { useSourceId = true } = {}) {
    this.spots.map(spot => spot.available = false);
    availableSpots.forEach((aS) => {
      this[useSourceId ? 'sourceIdMappedSpots' : 'idMappedSpots'][aS].available = true;
    });
    return this;
  };
  /**
   * @param {Array<object>} externalSpots list of zingfit spot data
   * @param {Array<string>} dibsCustomers list of dibs customers in the class by their zingfit ids
   * @returns {object} room instance
   */
  Room.prototype.reconcileDibsAndZingfitSpots = function reconcileDibsAndZingfitSpots(externalSpots, dibsCustomers) {
    externalSpots.forEach(eS =>
      this.sourceIdMappedSpots[eS.id].available = this.sourceIdMappedSpots[eS.id].available && (dibsCustomers.some(customer => customer === eS.customerId) || eS.status === 'Available')
    );
    return this;
  };

  /**
   *
   * @param {object} options optional params
   * @param {boolean} options.useSourceId which key to use
   * @returns {object} spot
   */
  Room.prototype.findNextAvailableSpot = function findNextAvailableSpot({ useSourceId = true } = {}) {
    return this.availableSpots.sort((a, b) => {
      const key = useSourceId ? 'source_id' : 'spot_label';
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
      return 0;
    })[0] || null;
  };

  /**
   *
   * @param {object} options optional params
   * @returns {number} dibs spot id
   */
  Room.prototype.findNextAvailableSpotId = function findNextAvailableSpotId(options = { useSourceId: true }) {
    const nextSpot = this.findNextAvailableSpot(options);
    return nextSpot && nextSpot.id;
  };

  return Room;
};
