const request = require('request');
const { Op } = require('sequelize');

/**
 * PricerClient - Description
 * @class PricerClient
 * @prop {string} [requestPrefix='https://dibs-pricer.herokuapp.com/api'] the request prefix
 */
function PricerClient() {
    this.requestPrefix = process.env.NODE_ENV === 'development' ? 'http://localhost:3001/api' : 'https://dibs-pricer.herokuapp.com/api';
}

/**
 * Updates an events pricing
 * @memberof PricerClient
 * @instance
 * @param {number} eventid the event id
 * @param {function} cb      the callback
 *
 * @returns {undefined}
 */
PricerClient.prototype.updatePrice = function updatePrice(eventid, cb) {
    if (process.env.NODE_ENV === 'production' && !process.env.STAGING) {
        request(
            {
                url: `${this.requestPrefix}/price/event/${eventid}`,
                method: 'PUT',
                auth: {
                    user: process.env.PRICER_LOGIN,
                    password: process.env.PRICER_PASSWORD
                }
            },
            (err, response, body) => {
                if (err) {
                    cb({ err, message: 'Something Went Wrong' }, null);
                } else if (response.statusCode > 300) {
                    const statusMessage = response.statusMessage;
                    cb({ status: statusMessage, message: `A timeout occurred while pricing event with id: ${eventid}` }, null);
                } else {
                    const parsedBody = JSON.parse(body);
                    if (!parsedBody.success) {
                        cb(parsedBody, null);
                    } else {
                        cb(null, parsedBody);
                    }
                }
            }
        );
    } else {
        cb(null, { success: true, message: 'Non-production purchase' });
    }
};

/**
 * Updates an events pricing
 * @memberof PricerClient
 * @instance
 * @param {number} eventid the event id
 *
 * @returns {Promise<Object>} parsed response body object
 */
PricerClient.prototype.updatePriceAsync = function updatePriceAsync(eventid) {
    // eslint-disable-next-line no-promise-executor-return
    return new Promise((resolve, reject) => this.updatePrice(eventid, (err, result) => (err ? reject(err) : resolve(result))));
};

/**
 * uploadZFCsv - Description
 * @memberof PricerClient
 * @instance
 * @param {number} studioid   the studio id
 * @param {number} locationid the location id
 * @param {string} file       the file
 * @param {function} cb         callback
 *
 * @returns {type} Description
 */
PricerClient.prototype.uploadZFCsv = function uploadZFCsv(studioid, locationid, file, cb) {
    request(
        {
            url: `${this.requestPrefix}/zf/attendees/${studioid}/${locationid}`,
            method: 'PUT',
            auth: {
                user: process.env.PRICER_LOGIN,
                password: process.env.PRICER_PASSWORD
            },
            formData: {
                [file.originalname]: {
                    value: file.buffer.toString('utf8'),
                    options: { filename: file.originalname }
                }
            }
        },
        (err, response, body) => {
            if (err) {
                cb(err);
            } else {
                cb(null, body);
            }
        }
    );
};

/**
 * @memberof PricerClient
 * @instance
 * @param {Array<number|string>} dibsStudioIds of studios to price
 *
 * @returns {Promise<Object>} response from the pricer server
 */
PricerClient.prototype.updateStudiosPrice = async function updateStudiosPrice(dibsStudioIds) {
    await models.event.update(
        { lastPricedAt: null, price: 1 },
        {
            where: {
                dibs_studio_id: dibsStudioIds,
                start_date: { [Op.gte]: new Date() },
                price: { [Op.gt]: 0 }
            }
        }
    );
    return new Promise((resolve, reject) => {
        request(
            {
                url: `${this.requestPrefix}/price/studios`,
                method: 'POST',
                auth: {
                    user: process.env.PRICER_LOGIN,
                    password: process.env.PRICER_PASSWORD
                },
                json: true,
                body: { studios: dibsStudioIds }
            },
            (err, response, body) => {
                if (err) {
                    return reject(err);
                }
                if (response.statusCode > 300) {
                    const statusMessage = response.statusMessage;
                    // eslint-disable-next-line prefer-promise-reject-errors
                    return reject(
                        {
                            status: statusMessage,
                            message: `A timeout occurred while pricing for studios with ids: ${dibsStudioIds.join(', ')}`
                        },
                        null
                    );
                }
                if (body.success) {
                    return resolve(body);
                }
                return reject(body);
            }
        );
    });
};

/**
 * Updates an entire studios pricing
 * @memberof PricerClient
 * @instance
 * @param {number} dibsStudioId the id of the studio
 * @param {function} cb         the calback
 *
 * @returns {undefined}
 */
PricerClient.prototype.updateStudioPrice = function updateStudioPrice(dibsStudioId, cb) {
    if (process.env.NODE_ENV === 'production' && !process.env.STAGING) {
        request(
            {
                url: `${this.requestPrefix}/price/studios`,
                method: 'POST',
                json: true,
                body: { studios: [dibsStudioId] },
                auth: {
                    user: process.env.PRICER_LOGIN,
                    password: process.env.PRICER_PASSWORD
                }
            },
            (err, response, body) => {
                if (err) {
                    cb({ err, message: 'Something Went Wrong' }, null);
                } else if (response.statusCode > 300) {
                    const statusMessage = response.statusMessage;
                    cb({ status: statusMessage, message: `A timeout occurred while pricing for studio with id: ${dibsStudioId}` }, null);
                } else if (!body.success) {
                    cb(body, null);
                } else {
                    cb(null, body);
                }
            }
        );
    } else {
        cb(null, { success: true, message: 'Non-production purchase' });
    }
};

module.exports = PricerClient;
