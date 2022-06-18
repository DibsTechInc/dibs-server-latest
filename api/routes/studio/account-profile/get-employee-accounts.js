const models = require('@dibs-tech/models');

const {
    Sequelize: { Op }
} = models;

async function getEmployeeAccounts(req, res) {
    try {
        const { dibsStudioId } = req.body;
        const activeEmployeeAccounts = await models.studio_employee.findAll({
            attributes: ['id', 'firstName', 'lastName', 'email', 'admin', 'instructor_only', 'phone'],
            where: {
                dibs_studio_id: dibsStudioId,
                deletedAt: null
            },
            order: [
                ['admin', 'DESC'],
                ['id', 'ASC'],
                ['lastName', 'ASC'],
                ['firstName', 'ASC'],
                ['instructor_only', 'DESC']
            ]
        });
        console.log(`\n\n\n\ndibsStudioId for inactive employee accounts: ${dibsStudioId}`);
        const inactiveEmployeeAccounts = await models.studio_employee.findAll({
            attributes: ['id', 'firstName', 'lastName', 'email', 'admin', 'instructor_only', 'phone', 'deletedAt'],
            where: {
                dibs_studio_id: dibsStudioId,
                deletedAt: {
                    [Op.ne]: null
                }
            },
            order: [
                ['admin', 'DESC'],
                ['id', 'ASC'],
                ['lastName', 'ASC'],
                ['firstName', 'ASC'],
                ['instructor_only', 'DESC']
            ],
            paranoid: false
        });
        console.log(`\n\n\n\ninactiveEmployeeAccounts is: ${JSON.stringify(inactiveEmployeeAccounts)}`);
        res.json({
            msg: 'success',
            activeEmployeeAccounts,
            inactiveEmployeeAccounts
        });
    } catch (err) {
        console.log(`\n\n\nerror in getEmployeeAccounts api call: ${err}`);
        res.json({
            msg: 'failure',
            error: err
        });
    }
    return { msg: 'failure - getEmployeeAccounts' };
}

module.exports = getEmployeeAccounts;
