const axios = require('axios');
const queryString = require('querystring');
const oauthAccess = require('../../models/caminte/oauthAccess');
const Promise = require('bluebird');

/**
 * HubspotClient Constructor
 * @constructor
 */
function HubspotClient() {
    this.apiURL = 'https://api.hubapi.com';
    this.formsURL = 'https://forms.hubspot.com';
    this.hubid = 3835886;
}

HubspotClient.prototype.initiate = async function initiate() {
    const [token] = await Promise.promisify(oauthAccess.find, { context: oauthAccess })({ type: 'hubspot' });
    if (!token) throw new Error('No Hubspot token in the Redis database');
    this.access_token = token.refresh_token;
    this.refresh_token = token.refresh_token;
    return token;
};

HubspotClient.prototype.refreshToken = function refreshToken() {
    return new Promise((reject, resolve) => {
        axios
            .post(
                `${this.apiURL}/oauth/v1/token`,
                {
                    grant_type: 'refresh_token',
                    redirect_uri: 'https://www.ondibs.com/webhooks/oauth/hubspot/token',
                    client_id: process.env.HUBSPOT_CLIENTID,
                    client_secret: process.env.HUBSPOT_SECRET,
                    refresh_token: this.refresh_token
                },
                {
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded'
                    }
                }
            )
            .then(({ data }) => {
                oauthAccess.update(
                    { type: 'hubspot' },
                    {
                        access_token: data.access_token,
                        refresh_token: data.refresh_token
                    },
                    (err, token) => {
                        if (err) reject(err);
                        else resolve(token);
                    }
                );
            })
            .catch(console.log);
    });
};

HubspotClient.prototype.sendFormData = function sendFormData(formId, data) {
    return axios.post(`${this.formsURL}/uploads/form/v2/${this.hubid}/${formId}`, queryString.stringify(data), {
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        }
    });
};

module.exports = HubspotClient;
