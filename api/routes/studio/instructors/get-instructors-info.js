const models = require('@dibs-tech/models');

const {
    Sequelize: { Op }
} = models;

async function getInstructorsInfo(req, res) {
    try {
        const { dibsStudioId } = req.body;
        const activeInstructorstosend = [];
        const inactiveInstructorstosend = [];
        const activeInstructors = await models.dibs_studio_instructors.findAll({
            attributes: [
                'id',
                'firstname',
                'lastname',
                'email',
                'email',
                'image_url',
                'mobilephone',
                'rate_per_class',
                'rate_per_head',
                'hurdle',
                'bonus_flat',
                'rev_share_perc',
                'enabled'
            ],
            where: {
                dibs_studio_id: dibsStudioId,
                deletedAt: null,
                enabled: true
            },
            order: [
                ['lastname', 'ASC'],
                ['firstname', 'ASC']
                // ['createdAt', 'ASC']
            ]
        });
        const disabledInstructors = await models.dibs_studio_instructors.findAll({
            attributes: [
                'id',
                'firstname',
                'lastname',
                'email',
                'email',
                'image_url',
                'mobilephone',
                'rate_per_class',
                'rate_per_head',
                'hurdle',
                'bonus_flat',
                'rev_share_perc',
                'enabled'
            ],
            where: {
                dibs_studio_id: dibsStudioId,
                deletedAt: null,
                enabled: true
            },
            order: [
                ['lastname', 'ASC'],
                ['firstname', 'ASC']
                // ['createdAt', 'ASC']
            ]
        });
        const getLoginStatus = async (instructor) => {
            const response = await models.studio_employee.findOne({
                attributes: ['id', 'admin', 'instructor_only'],
                where: {
                    dibs_studio_id: dibsStudioId,
                    email: instructor.email
                }
            });
            console.log(`response is: ${JSON.stringify(response)}`);
            if (response) {
                console.log(`is a response so this is true`);
                console.log('returning true');
                return { canlogin: true, instructor_only: response.instructor_only, admin: response.admin };
            }
            console.log('returning false');
            return { canlogin: false, instructor_only: false, admin: false };
        };
        Promise.all(
            activeInstructors.map(async (instructor) => {
                const hasAccount = await getLoginStatus(instructor);
                activeInstructorstosend.push({ ...instructor.dataValues, hasAccount });
                return instructor;
            }),
            disabledInstructors.map(async (instructor) => {
                const hasAccount = await getLoginStatus(instructor);
                inactiveInstructorstosend.push({ ...instructor.dataValues, hasAccount });
                return instructor;
            })
        ).then(() => {
            res.json({
                msg: 'success',
                activeInstructors: activeInstructorstosend,
                disabledInstructors: inactiveInstructorstosend
            });
        });
    } catch (err) {
        console.log(`\n\n\nerror in getInstructorsInfo api call: ${err}`);
        res.json({
            msg: 'failure',
            error: err
        });
    }
    return { msg: 'failure - getInstructorsInfo' };
}

module.exports = getInstructorsInfo;
