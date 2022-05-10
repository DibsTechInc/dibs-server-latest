const models = require('@dibs-tech/models');
const { Op } = require('sequelize');

async function getUpcomingClasses(req, res) {
    try {
        console.log(`\n\n\n\n\n\nreq.body = ${JSON.stringify(req.body)}`);
        console.log(`\n\n\ndate of now is: ${new Date()}`);
        const classestoreturn = [];
        const upcomingClasses = await models.attendees.findAll({
            attributes: ['eventid', 'serviceName', 'attendeeID', 'visitDate'],
            where: {
                userid: req.body.userid,
                dibs_studio_id: req.body.dibsStudioId,
                dropped: false,
                visitDate: {
                    [Op.gte]: new Date()
                }
            }
        });
        console.log(`\n\n\n\n\n%%%%%%%%%%%\n\nupcomingClasses is: ${JSON.stringify(upcomingClasses)}\n\n\n`);
        if (upcomingClasses) {
            console.log(`if is true -> upcomingClasses = ${JSON.stringify(upcomingClasses)}\n\n\n`);
            const addClassToArray = async (eventid) =>
                new Promise((resolve, reject) => {
                    console.log(`inside of promise for classes`);
                    // get name of the class + name of instructor
                    const getclassdata = async () => {
                        const classinfo = await models.event.findOne({
                            attributes: ['name', 'trainerid', 'locationid'],
                            where: {
                                eventid
                            },
                            include: [
                                {
                                    model: models.dibs_studio_instructors,
                                    as: 'instructor',
                                    attributes: ['firstname', 'lastname']
                                },
                                {
                                    model: models.dibs_studio_locations,
                                    as: 'location',
                                    attributes: ['short_name', 'name', 'city']
                                }
                            ]
                        });
                        const transactionInfo = await models.dibs_transaction.findAll({
                            attributes: ['id', 'with_passid'],
                            where: {
                                eventid,
                                userid: req.body.userid,
                                deletedAt: null,
                                void: false
                            },
                            include: [
                                {
                                    model: models.passes,
                                    as: 'pass',
                                    attributes: ['id'],
                                    include: [
                                        {
                                            model: models.studio_packages,
                                            as: 'studioPackage',
                                            attributes: ['id', 'name']
                                        }
                                    ]
                                }
                            ]
                        });
                        await classestoreturn.push({
                            transactionid: transactionInfo[0].id,
                            eventid,
                            classtitle: classinfo.name,
                            instructor: `${classinfo.instructor.firstname} ${classinfo.instructor.lastname}`,
                            location: classinfo.location.city,
                            spots_booked: transactionInfo.length,
                            passid: transactionInfo[0].with_passid || 0,
                            packageUsed: transactionInfo[0].pass.studioPackage.name || 'Drop In'
                        });
                        resolve();
                    };
                    getclassdata();
                });
            const promises = [];
            upcomingClasses.forEach((upcomingClass) => {
                promises.push(addClassToArray(upcomingClass.eventid));
            });
            Promise.all(promises)
                .then(() => {
                    res.json({
                        msg: 'success',
                        upcomingClasses: classestoreturn
                    });
                })
                .catch((err) => {
                    console.log(`error in getUpcomingClasses. Error is: ${err}`);
                    res.json({
                        msg: 'error',
                        err
                    });
                });
        } else {
            console.log(`client ${req.body.userid} does not have any upcoming classes`);
        }
    } catch (err) {
        console.log(`error in getUpcomingClasses api call: ${err}`);
        return err;
    }
    return { msg: 'failure - getUpcomingClasses' };
}

module.exports = getUpcomingClasses;
