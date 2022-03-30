const axios = require('axios');
const moment = require('moment');
const queryString = require('query-string');

/**
 * @constructor
 * @param {string} apiKey api key to validate requests
 * @param {string} log  log to run requests against
 */
function LogEntriesClient(apiKey = process.env.LOGENTRY_API_KEY, log = process.env.DEFAULT_LOG_KEY) {
  this.log = log;
  this.axios = axios.create({
    baseURL: 'https://rest.logentries.com/',
    headers: {
      'x-api-key': apiKey,
    },
  });
}
/**
 * Runs a log entry query
 * @param {string} q  Log entry query
 * @param {moment} startTime start time to query log for defaults to 50 milliseconds before function call
 * @param {moment} endTime   end time to query log for. defaults to 50 milliseconds after function call
 * @returns {promise} resolved axios request
 */
LogEntriesClient.prototype.query = async function query(q, startTime = moment().subtract(50, 'milliseconds'), endTime = moment().add(50, 'milliseconds')) {
  const qs = queryString.stringify({
    query: `where(${q})`,
    from: moment(startTime).valueOf(),
    to: moment(endTime).valueOf(),
  }, {
      encode: false,
    });
  const { data: { id } } = await this.axios(`/query/logs/${this.log}/?${qs}`);
  return this.axios.get(`/query/${id}`);
};
/**
 * Runs a log entry query
 * @param {string} q  Log entry query
 * @param {moment} startTime start time to query log for defaults to 50 milliseconds before function call
 * @param {moment} endTime   end time to query log for. defaults to 50 milliseconds after function call
 * @returns {string} link to logentry
 */
LogEntriesClient.prototype.linkToLog = function query(q, startTime = moment().subtract(1, 'seconds'), endTime = moment().add(1, 'seconds')) {
  const qs = queryString.stringify({
    log_q: `where(${q})`,
    f: moment(startTime).valueOf(),
    t: moment(endTime).valueOf(),
  }, {
      encode: false,
    });
  return `https://logentries.com/app/2a62d1ed#/search/log/${this.log}?${qs}`;
};

module.exports = LogEntriesClient;
