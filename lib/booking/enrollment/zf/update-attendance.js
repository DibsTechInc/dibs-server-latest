const { mapZFAttendance, getZFUserClasses } = require('../../../helpers/zf-attendee-mapper');

module.exports = async function updateZingfitAttendance(user, studio) {
    const events = await models.event.findAll({ where: { dibs_studio_id: studio.id }, attributes: ['classid', 'eventid'] });

    const rooms = await models.room.findAll({
        where: {
            dibs_studio_id: studio.id
        },
        include: [
            {
                model: models.spot
            }
        ],
        hooks: false
    });

    const zfattendance = await getZFUserClasses(user, studio);
    return mapZFAttendance({ user, studio, events, rooms, zfattendance });
};
