const { uniq } = require('lodash');
const extractInnerList = require('../../../helpers/extract-inner-list');
const failOnOffboarded = require('../helpers/fail-on-offboarded');
const purchaseErrorLib = require('../../../errors/purchasing');

/**
 * @param {Array<Object>} eventItems in cart
 * @returns {Array<Object>} cart event items with their associated event instances
 */
module.exports = async function queryEvents(eventItems) {
    if (!eventItems.length) return [];
    const eventids = uniq(eventItems.map((item) => item.eventid));
    const events = await models.event.findAll({
        where: { eventid: eventids },
        include: [
            {
                model: models.dibs_studio,
                as: 'studio',
                include: [
                    {
                        model: models.dibs_config,
                        as: 'dibs_config'
                    },
                    {
                        model: models.dibs_studio_locations,
                        as: 'locations'
                    }
                ]
            },
            {
                model: models.dibs_studio_locations,
                as: 'location',
                attributes: ['tax_rate', 'region_id', 'source_location_id']
            }
        ]
    });
    extractInnerList(events, 'studio', 'id').map(failOnOffboarded);
    const eventItemsWithData = eventItems.map(({ eventid, ...item }) => ({
        ...item,
        eventid,
        event: events.find((e) => e.eventid === eventid)
    }));
    const itemsWithoutEvents = uniq(eventItemsWithData.filter((item) => !item.event).map((item) => item.eventid));
    if (itemsWithoutEvents.length) {
        throw new purchaseErrorLib.CartError(`Cart has non-existent event(s): ${itemsWithoutEvents.join(', ')}`);
    }
    return eventItemsWithData;
};
