const errorHelper = require('../../../../lib/errors');

const {
    Sequelize: { Op }
} = models;

module.exports = async function getAttendanceData(req, res) {
    const { dibsStudioId, attendanceInfo } = req.body;
    const { startDate, endDate } = attendanceInfo;
    try {
        const reportData = await models.attendees.findAll({
            attributes: [
                'id',
                'attendeeID',
                'eventid',
                'userid',
                'firstname',
                'lastname',
                'email',
                'visitDate',
                'checkedin',
                'dropped',
                'early_cancel',
                'spot_id'
            ],
            where: {
                dibs_studio_id: dibsStudioId,
                visitDate: {
                    [Op.between]: [startDate, endDate]
                }
            },
            include: [
                {
                    model: models.event,
                    as: 'events',
                    attributes: ['eventid', 'locationid', 'name', 'trainerid', 'price_dibs', 'private', 'category', 'on_demand'],
                    include: [
                        {
                            model: models.dibs_studio_locations,
                            as: 'location',
                            attributes: ['name']
                        },
                        {
                            model: models.dibs_studio_instructors,
                            as: 'instructor',
                            attributes: ['firstname', 'lastname']
                        }
                    ]
                }
            ],
            order: [
                ['visitDate', 'ASC'],
                ['lastname', 'ASC'],
                ['firstname', 'ASC']
            ]
        });
        console.log(`\n\n\n\n\nattendance reportData: ${JSON.stringify(reportData)}`);
        res.json(apiSuccessWrapper({ reportData }, 'Successfully retrieved attendance data'));
    } catch (err) {
        errorHelper.handleError({
            opsSubject: 'Get Attendance Data Error',
            employeeid: dibsStudioId,
            res
        })(err);
    }
};
