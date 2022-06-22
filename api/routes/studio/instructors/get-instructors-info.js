const models = require('@dibs-tech/models');

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
                'updatedAt',
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
                'updatedAt',
                'hurdle',
                'bonus_flat',
                'rev_share_perc',
                'enabled'
            ],
            where: {
                dibs_studio_id: dibsStudioId,
                deletedAt: null,
                enabled: false
            },
            order: [
                ['lastname', 'ASC'],
                ['firstname', 'ASC']
                // ['createdAt', 'ASC']
            ]
        });
        const addLoginStatus = async (instructor, activeStatus) => {
            const response = await models.studio_employee.findOne({
                attributes: ['id', 'admin', 'instructor_only'],
                where: {
                    dibs_studio_id: dibsStudioId,
                    email: instructor.email
                }
            });
            const prod = async () =>
                new Promise((resolve, reject) => {
                    console.log(`\n\n\n\n*********instructor in addLoginStatus is: ${JSON.stringify(instructor)}`);
                    console.log(`email is: ${instructor.email}`);
                    console.log(`\n\n\n#########\n\nresponse from studio employee search is: ${JSON.stringify(response)}\n\n`);
                    if (activeStatus === 'active') {
                        if (response !== null) {
                            activeInstructorstosend.push({
                                ...instructor.dataValues,
                                hasLogin: { canlogin: true, instructor_only: response.instructor_only, admin: response.admin }
                            });
                            resolve();
                        } else {
                            activeInstructorstosend.push({
                                ...instructor.dataValues,
                                hasLogin: { canlogin: false, instructor_only: false, admin: false }
                            });
                            resolve();
                        }
                        reject();
                    } else if (activeStatus === 'disabled') {
                        if (response !== null) {
                            inactiveInstructorstosend.push({
                                ...instructor.dataValues,
                                hasLogin: { canlogin: true, instructor_only: response.instructor_only, admin: response.admin }
                            });
                            resolve();
                        } else {
                            inactiveInstructorstosend.push({
                                ...instructor.dataValues,
                                hasLogin: { canlogin: false, instructor_only: false, admin: false }
                            });
                            resolve();
                        }
                        reject();
                    }
                    console.log(`\n\ncount if active is: ${activeInstructorstosend.length}`);
                    console.log(`\n\ncount if inactive is: ${inactiveInstructorstosend.length}`);
                    return instructor;
                });
            prod();
        };
        const promises = [];
        activeInstructors.forEach((instructor) => {
            promises.push(addLoginStatus(instructor, 'active'));
        });
        disabledInstructors.forEach((instructor) => {
            promises.push(addLoginStatus(instructor, 'disabled'));
        });
        await Promise.all(promises).then(() => {
            console.log('taking next step');
            console.log(`\n\n\n\nactiveInstructorstosend count is: ${JSON.stringify(activeInstructorstosend.length)}`);
            console.log(`\n\n\n\ndisaledInstructorstosend count is: ${JSON.stringify(inactiveInstructorstosend.length)}`);
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
