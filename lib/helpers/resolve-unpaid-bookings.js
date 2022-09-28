const resolveNestedObject = require('./resolve-nested-object');
// const MBClient = require('@dibs-tech/mindbody-client');
const Promise = require('bluebird');
const { Op } = require('sequelize');

/**
 * @param {Object} obj with transactions, pass, user
 * @returns {Object} nested object
 */
module.exports = async function resolveUnpaidBookings({ pass, user, studio }) {
    // const mbc = new MBClient(process.env.MINDBODY_USERNAME, process.env.MINDBODY_PASSWORD, studio.studioid);
    const userStudio = user.userStudios.find((us) => us.dibs_studio_id === studio.id);
    const unpaidTransactions = await models.dibs_transaction.findAll({
        where: {
            userid: user.id,
            unpaid: true
        },
        include: [
            {
                model: models.event,
                as: 'event',
                key: 'eventid'
            }
        ]
    });
    const unpaidEvents = unpaidTransactions.map((t) => t.event);
    console.log(`\n\n\n${JSON.stringify(unpaidEvents)} - unpaid events found for user ${user.id}`);
    // TO DO - handle unpaid events if needed - I believe this was for mindbody only
    // await models.sequelize.transaction(async (sqlTransaction) =>
    //     Promise.map(
    //         unpaidEvents,
    //         async (e) => {
    //             const getClassVisitsResp = await Promise.promisify(mbc.getVisits, { context: mbc })(e.classid);
    //             let visits = resolveNestedObject(getClassVisitsResp, 'GetClassVisitsResult', 'Class', 'Visits', 'Visit');
    //             visits = visits.filter((v) => v.Client.ID === userStudio.clientid);
    //             if (!visits || !visits.length) return;

    //             const mbServiceDibs = await models.mb_service.findOne({
    //                 where: {
    //                     name: { [Op.iLike]: 'Dibs' },
    //                     mbstudioid: e.studioid,
    //                     mbprogramid: e.programid
    //                 }
    //             });
    //             if (!mbServiceDibs) throw new Error(`No Dibs service with MB studio id ${e.studioid} and MB program id ${e.programid}`);
    //             const visitServices = [
    //                 {
    //                     serviceid: mbServiceDibs.mbserviceid,
    //                     visitids: visits.map((v) => v.ID)
    //                 }
    //             ];
    //             await pass.addUses(visitServices[0].visitids.length, { transaction: sqlTransaction });
    //             await Promise.promisify(mbc.updateVisitService, { context: mbc })(
    //                 userStudio.clientid,
    //                 visitServices,
    //                 process.env.TEST_PURCHASES
    //             );
    //             await Promise.map(unpaidTransactions, async (t) => {
    //                 if (t.event.eventid !== e.eventid) return;
    //                 t.with_passid = pass.id;
    //                 t.unpaid = false;
    //                 await t.save({ transaction: sqlTransaction });
    //             });
    //             await pass.save({ transaction: sqlTransaction });
    //         },
    //         { concurrency: 1 }
    //     )
    // );
    return null;
};
