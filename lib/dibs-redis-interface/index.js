const Enum = require('enum');
const redis = require('redis');
const Promise = require('bluebird');
// const { handleError } = require('@dibs-tech/dibs-error-handler');
const { handleError } = require('../dibs-error-handler');



const redisURL = process.env.NODE_ENV === 'production' ? process.env.REDISCLOUD_URL : 'redis://127.0.0.1:6379';

const redisClient = process.env.USE_CACHING && redisURL ? Promise.promisifyAll(redis).createClient(redisURL) : null;

/**
 * Updates cached data where necessary
 * @param {object} data sequelize instance
 * @returns {Promise} resolved promise
 */
async function updateInstance(instance) {
  try {
    if (!redisClient || !instance) return null;
    return redisClient.setAsync(`${instance.constructor.name}-${instance.id}`, JSON.stringify(instance), 'EX', process.env.CACHE_EXPIRY || 300);
  } catch (err) {
    handleError({
      opsSubject: 'Cache Error',
      opsIncludes: `Error updating key ${instance.constructor.name}-${instance.id} in Redis`,
    })(err);
    return null;
  }
}

/**
 *
 * @param {string} key Redis key
 * @returns {Promise} JSON data
 */
async function retrieveJSON(key) {
  try {
    if (!redisClient) return null;
    const data = await redisClient.getAsync(key);
    if (data) return JSON.parse(data);
    return null;
  } catch (err) {
    handleError({
      opsSubject: 'Retrieve JSON Error',
      opsIncludes: `Error retrieving key ${key} in Redis`,
    })(err);
    return null;
  }
}

/**
 * @param {string} key identifier
 * @param {object} json object to store
 * @param {object} options optional params
 * @param {number} options.expire time to expire in seconds
 * @return {null} null response
 */
async function setJSON(key, json, { expire } = {}) {
  try {
    if (!redisClient) return null;
    const additionalArgs = expire ? ['EX', expire] : [];
    const data = await redisClient.setAsync(key, JSON.stringify(json), ...additionalArgs);
    return data;
  } catch (err) {
    handleError({
      opsSubject: 'PUT JSON Error',
      opsIncludes: `Error setting a key ${key} in Redis`,
    })(err);
    return null;
  }
}

const Positions = new Enum(['HEAD', 'TAIL'])
/**
 *
 * @param {string} key identifier
 * @param {string} value value to store
 * @param {object} options  optional parameters
 * @param {number} options.expire time to expire in seconds
 * @param {number=Infinity} options.listSize maximimum size of the list
 * @param {Enum} options.position position in the list to add the new item
 */
async function addToList(key, value, { expire, listSize = Infinity, position = Positions.HEAD  } = {}) {
  try {
    if (!redisClient) return null;
    if (!Positions.isDefined(position)) throw new Error('Invalid position for insertion');
    await redisClient[position === Positions.HEAD ? 'lpushAsync' : 'rpushAsync'](key, value);
    if (expire) await redisClient.expireAsync(key, expire)
    if (await redisClient.llenAsync(key) >= listSize) {
      await redisClient.ltrimAsync(key, 0, listSize - 1)
    }
    return null;
  } catch (err) {
    handleError({
      opsSubject: 'PUT JSON Error',
      opsIncludes: `Error setting a key ${key} in Redis`,
    })(err);
    return null;
  }
}
/**
 *
 * @param {string} key identifier
 * @param {object} options optional parameters
 * @param {Enum} options.position position in the list to add the new item
 * @return {string} value of removed element from redis list
 */
async function popFromList(key, { position = Positions.HEAD } = {}) {
  try {
    if (!redisClient) return null;
    if (!Positions.isDefined(position)) throw new Error('Invalid position for insertion');
    const data = await redisClient[position === Positions.HEAD ? 'lpopAsync' : 'rpopAsync'](key);
    return data;
  } catch (err) {
    handleError({
      opsSubject: 'PUT JSON Error',
      opsIncludes: `Error setting a key ${key} in Redis`,
    })(err);
    return null;
  }
}
/**
 *
 * @param {string} key  identifier
 * @return {array} list from redis
 */
async function getList(key) {
  try {
    if (!redisClient) return [];
    const data = await redisClient.lrangeAsync(key, 0, -1);
    return data;
  } catch (err) {
    handleError({
      opsSubject: 'PUT JSON Error',
      opsIncludes: `Error setting a key ${key} in Redis`,
    })(err);
    return [];
  }
}

module.exports = {
  redisClient,
  updateInstance,
  retrieveJSON,
  setJSON,
  Positions,
  addToList,
  popFromList,
  getList,
};
