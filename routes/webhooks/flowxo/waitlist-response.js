const { Op } = require('sequelize');
const moment = require('moment-timezone');
const dropLib = require('../../../lib/drop');
const { handleError } = require('../../../lib/helpers/error-helper');
// const sqlQueryReader = require('../../../lib/helpers/sql-query-reader');
const { checkoutCart } = require('../../../lib/purchasing/checkout');
const { userIncludeConfig } = require('../../../config/passport/include-config');
const { notifyUserByText } = require('../../../lib/purchasing/checkout/flowxo');

/**
 * receiveWaitlistResponse - Description
 *
 * @param {type} req Description
 * @param {type} res Description
 * @returns {undefined}
 */

async function receiveWaitlistResponse(req, res) {
    const eventidToSend = Number(req.body.eventid);
    // drop client from the class
    const dropSource = 'widget';
    try {
        const userData = await models.dibs_user.findOne({
            where: {
                id: req.body.userid
            }
        });
        await dropLib.dropUserFromEvent({
            user: userData,
            eventid: eventidToSend,
            dropSource,
            droppedDuringGracePeriod: true
        });
        // book the next client from the waitlist
        const nextClient = await models.dibs_transaction.findOne({
            where: {
                eventid: eventidToSend,
                type: models.dibs_transaction.Types.WAITLIST,
                deletedAt: null,
                void: { [Op.not]: true }
            },
            order: [['id', 'ASC']]
        });
        // if there is another client on the waitlist - book them into class
        if (nextClient && Object.keys(nextClient).length !== 0) {
            console.log(nextClient.userid);
            let passidToPass;
            if (nextClient.with_passid) {
                passidToPass = nextClient.with_passid;
                const passes = await models.passes.findOne({
                    where: { id: nextClient.with_passid }
                });
                const totalUsesUpdated = passes.usesCount - 1;
                await models.passes.update(
                    {
                        usesCount: totalUsesUpdated
                    },
                    {
                        where: {
                            id: nextClient.with_passid
                        }
                    }
                );
            } else {
                passidToPass = null;
            }
            const eventData = await models.event.findById(eventidToSend, {
                where: {
                    eventid: eventidToSend,
                    canceled: 0,
                    deleted: 0
                }
            });
            // remove them from the waitlist
            await models.dibs_transaction.update(
                { deletedAt: moment() },
                {
                    where: {
                        userid: nextClient.userid,
                        eventid: eventidToSend,
                        void: false,
                        type: 'wait'
                    },
                    paranoid: false
                }
            );
            const user = await models.dibs_user.findById(nextClient.userid, {
                include: [
                    {
                        model: models.dibs_user_studio,
                        as: 'userStudios',
                        where: {
                            dibs_studio_id: eventData.dibs_studio_id
                        },
                        required: false
                    },
                    ...userIncludeConfig(models)
                ]
            });

            const locationStats = await models.dibs_studio_locations.findById(eventData.locationid);
            // add class to client cart
            const cart = {
                events: [
                    {
                        start_time: eventData.start_date,
                        eventid: eventidToSend,
                        passid: passidToPass,
                        price: eventData.price_dibs,
                        taxRate: locationStats.tax_rate,
                        quantity: 1,
                        spotIds: []
                    }
                ]
            };
            const employeeInfo = await models.studio_employee.findOne({
                where: {
                    dibs_studio_id: eventData.dibs_studio_id,
                    deletedAt: null
                },
                order: [['createdAt', 'desc']]
            });
            const promoCode = {};
            await checkoutCart({
                user,
                cart,
                promoCode,
                purchasePlace: 'studio admin',
                employeeid: employeeInfo.id
            });
            notifyUserByText({
                userid: nextClient.userid,
                eventidToSend,
                mobilephone: nextClient.mobilephone
            });
        }
        return res.status(200).send();
    } catch (err) {
        return handleError({
            opsSubject: 'Dropping Client from Class Post Waitlist Error',
            res,
            resMessage: `failed to drop client: ${req.body.userid} from class: ${eventidToSend}`
        })(err);
    }
}
module.exports = receiveWaitlistResponse;
