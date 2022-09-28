const { handleError } = require('@dibs-tech/dibs-error-handler');
const moment = require('moment-timezone');
const sqlQueryReader = require('../../../../lib/helpers/sql-query-reader');

const { redisClient, retrieveJSON } = require('@dibs-tech/redis-interface');

module.exports = async function getEvents(req, res) {
    const startTime = req.query.start || moment().startOf('day');
    const endTime = req.query.end || moment().add(14, 'days').endOf('day');
    // const endTime = moment().add(20, 'days').endOf('day');
    const eventId = req.query.event_id ? Number(req.query.event_id) : 0;
    const eventids = req.query.eventids || [];
    const instructorOnly = req.query.instructor_only ? req.query.instructor_only : false;
    const instructorEmail = req.query.instructor_email ? req.query.instructor_email : '';
    const classId = req.query.class_id ? req.query.class_id : 0;
    const studioData = req.query.studios || [];
    try {
        const user = req.user;
        const QUERY = sqlQueryReader(`${__dirname}/sql/get-events.sql`);
        const QUERY_BY_TRAINER = sqlQueryReader(`${__dirname}/sql/get-events-by-trainerid.sql`);

        const byDate = !eventids.length;
        const byEventid = !byDate;
        /* Array of dibs_studio.id */
        let events = await sequelize.query(QUERY, {
            type: sequelize.QueryTypes.SELECT,
            bind: {
                byDate,
                byEventid,
                studioData,
                startTime,
                endTime,
                eventids
            }
        });
        const queryInstructorId = sqlQueryReader(`${__dirname}/sql/get-instructor-id.sql`);
        if (instructorOnly) {
            const instructorId = await sequelize.query(queryInstructorId, {
                type: sequelize.QueryTypes.SELECT,
                bind: {
                    instructorEmail,
                    studioID: parseInt(studioData, 10)
                }
            });
            // console.log(`instructorID is: ${JSON.stringify(instructor_id[0].id)}`);

            /* Array of dibs_studio.id */
            events = await sequelize.query(QUERY_BY_TRAINER, {
                type: sequelize.QueryTypes.SELECT,
                bind: {
                    byDate,
                    byEventid,
                    studioData,
                    startTime,
                    endTime,
                    eventids,
                    trainerId: instructorId[0].id || 0
                }
            });
            console.log(`events ==> ${JSON.stringify(events)}`);
        }

        if (events === null) return res.json(apiSuccessWrapper({ events: [] }, 'No Events'));

        const items = events;
        const isFiltered = Boolean(eventId || classId);
        const filteredItem = isFiltered && items.filter((item) => item.id === eventId || item.classid === classId)[0];

        let response;
        switch (true) {
            case isFiltered && !filteredItem:
                response = apiFailureWrapper({}, 'No Event with that combination');
                break;
            case isFiltered:
                response = apiSuccessWrapper({ event: filteredItem });
                break;
            case req.query.city:
                response = apiSuccessWrapper({ events: items.filter((event) => event.location.city === req.query.city) });
                break;
            default:
                response = apiSuccessWrapper({ events: items });
        }
        if (redisClient) await redisClient.setAsync(`${req.path}-${JSON.stringify(req.query)}`, JSON.stringify(response), 'EX', 300);
        return res.json(response);
    } catch (err) {
        const errorParams = {
            res,
            opsSubject: 'GET Events Error'
        };
        switch (true) {
            case eventId:
                errorParams.opsIncludes = `Failure in retrieving a studio's event StudioID: ${studioData}, EventID: ${eventId} Error: ${err.stack}`;
                errorParams.resMessage = 'Could not retrieve a specific event for this studio';
                break;
            case classId:
                errorParams.opsIncludes = `Failure in retrieving a studio's event StudioID: ${studioData}, ClassID: ${classId} Error: ${err.stack}`;
                errorParams.resMessage = 'Could not retrieve a specific class for this studio';
                break;
            default:
                errorParams.opsIncludes = `Failure in retrieving a studio's events StudioID: ${studioData} Error: ${err.stack}`;
                errorParams.resMessage = 'Could not retrieve a list of events for this studio';
                break;
        }
        return handleError(errorParams)(err);
    }
};
