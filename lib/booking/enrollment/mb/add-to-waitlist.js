// const MBClient = require('@dibs-tech/mindbody-client');
const Promise = require('bluebird');
const resolveNestedObject = require('../../../helpers/resolve-nested-object');
const { AddToWaitlistError } = require('../../../errors/booking');
const updateEvent = require('../shared/waitlist-update-event');
/**
 * @param {Object} user being added to the waitlist
 * @param {Object} event instance, the class they want to attend
 * @param {Object} pass instance to use for the class (optional)
 * @returns {Promise<string>} waitlist id they were added under in MB
 */
module.exports = async function addToMindbodyWaitlist(user, event, pass) {
    try {
        // const mbc = new MBClient(process.env.MINDBODY_USERNAME, process.env.MINDBODY_PASSWORD, event.studioid);

        // const mbGetVisitsResp = await Promise.promisify(mbc.getVisits, { context: mbc })(event.classid);

        // const isWaitlistAvailable = resolveNestedObject(mbGetVisitsResp, 'GetClassVisitsResult', 'Class', 'IsWaitlistAvailable');
        // if (!isWaitlistAvailable) {
        //     await updateEvent(event, { has_waitlist: false });
        //     throw new AddToWaitlistError('Waitlist is unavailable in Mindbody', { waitlistUnavailable: true });
        // }

        // const visits = resolveNestedObject(mbGetVisitsResp, 'GetClassVisitsResult', 'Class', 'Visits', 'Visit');
        // if (!visits && event.seats !== 0) {
        //     throw new Error('Could not receive visit information from Mindbody');
        // }

        // if (event.seats !== 0 && visits.length < event.seats) {
        //     await updateEvent(event, { spots_booked: visits.length });
        //     throw new AddToWaitlistError('Event is no longer full', { eventNoLongerFull: true });
        // }

        const userStudio = await models.dibs_user_studio.findOne({
            where: {
                userid: user.id,
                dibs_studio_id: event.dibs_studio_id
            }
        });
        if (!userStudio) {
            throw new AddToWaitlistError(`User does not have a dibs_user_studio at studio ${event.dibs_studio_id}`);
        }

        // const clientidsInClass = visits && visits.map((visit) => visit.Client.ID);
        // if (clientidsInClass && clientidsInClass.find((clientid) => clientid === userStudio.clientid)) {
        //     throw new AddToWaitlistError('User is already enrolled in the class in Mindbody', { alreadyEnrolled: true });
        // }

        const clientid = (pass && pass.clientid) || userStudio.clientid;
        if (!clientid) {
            throw new AddToWaitlistError('User does not have a Mindbody client id');
        }

        const clientServiceId = (pass && pass.source_serviceid) || null;

        // const addToWaitlistResp = await Promise.promisify(mbc.addUserToWaitlist, { context: mbc })(
        //     clientid,
        //     event.classid,
        //     clientServiceId
        // );

        // const classes = resolveNestedObject(addToWaitlistResp, 'AddClientsToClassesResult', 'Classes', 'Class');
        // if (!classes || !classes[0].IsWaitlistAvailable) {
        //     await updateEvent(event, { has_waitlist: false });
        //     throw new AddToWaitlistError('Waitlist is unavailable in Mindbody', { waitlistUnavailable: true });
        // }

        // const getWaitlistResp = await Promise.promisify(mbc.getWaitlist, { context: mbc })(event.classid);

        // const waitlistEntries = resolveNestedObject(getWaitlistResp, 'GetWaitlistEntriesResult', 'WaitlistEntries', 'WaitlistEntry');
        // const waitlistEntry = waitlistEntries && waitlistEntries.find((wl) => wl.Client.ID === clientid);
        // if (!waitlistEntry) {
        //     throw new AddToWaitlistError('Failed to add user to the waitlist after successfully making AddClientsToClasses call');
        // }

        return 1234;
    } catch (err) {
        if (err instanceof AddToWaitlistError) throw err;
        throw new AddToWaitlistError(err);
    }
};
