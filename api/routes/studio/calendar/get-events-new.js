const models = require('@dibs-tech/models');
const { Op } = require('sequelize');
const moment = require('moment-timezone');
// const { reject } = require('bluebird');

async function getAllEvents(req, res) {
    try {
        // const classestoreturn = [];
        const classestoreturn = await models.event.findAll({
            attributes: [
                'eventid',
                ['name', 'title'],
                'eventtype',
                'trainerid',
                'start_date',
                'end_date',
                'locationid',
                'isFull',
                'is_recurring',
                'address',
                'price_dibs',
                'spots_booked',
                'has_waitlist',
                'can_apply_pass',
                'class_notes',
                'private',
                'on_demand',
                'dibsclassid',
                'manual_track_id',
                'zoom_password',
                'room_id',
                'copy_zoomlink_forward'
            ],
            where: {
                dibs_studio_id: req.body.dibsid,
                canceled: 0,
                deleted: 0,
                start_date: {
                    [Op.and]: {
                        [Op.gte]: moment().tz('America/New_York').startOf('month'),
                        [Op.lte]: moment().tz('America/New_York').add(3, 'months')
                    }
                }
            },
            include: [
                // {
                //     model: models.dibs_studio,
                //     as: 'studio',
                //     include: [
                //         {
                //             model: models.dibs_config,
                //             as: 'dibs_config'
                //         },
                //         {
                //             model: models.dibs_studio_locations,
                //             as: 'locations'
                //         }
                //     ]
                // },
                {
                    model: models.dibs_studio_instructors,
                    as: 'instructor',
                    attributes: ['id', 'firstname', 'lastname', 'email', 'mobilephone', 'image_url']
                }
            ],
            order: [['start_date', 'ASC']]
        });
        res.json({
            msg: 'success',
            classEvents: classestoreturn
        });
    } catch (err) {
        console.log(`error in getEventsNew api call: ${err}`);
        return err;
    }
    return { msg: 'failure - get Events (New)' };
}

module.exports = getAllEvents;
