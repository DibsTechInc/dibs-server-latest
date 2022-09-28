const TwilioClient = require('../../../lib/twilio/twilio-client');
const { handleError } = require('../../../lib/helpers/error-helper');
const xml = require('xml');

const tc = new TwilioClient();

/**
 * receiveCall
 * @param {Express.Request} req HTTP request
 * @param {Express.Response} res HTTP response
 * @returns {undefined}
 */
function receiveCall(req, res) {
    let responseSent = false;

    tc.handleReceivedCall()
        .then((response) => {
            res.set('content-type', 'text/xml');
            res.send(response);
            responseSent = true;
        })
        .then(() => tc.notifyDibsOfIncomingInteraction('call', req.body.From))
        .catch(
            handleError({
                opsSubject: 'Twilio Phone Call Webhook Error',
                callback() {
                    if (responseSent) return;
                    res.set('content-type', 'text/xml');
                    res.send(xml('<Response />'));
                }
            })
        );
}

module.exports = receiveCall;
