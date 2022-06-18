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
        console.log(`\n\n\n\nactiveEmployeeAccounts is: ${JSON.stringify(activeEmployeeAccounts)}`);
        const inactiveEmployeeAccounts = await models.studio_employee.findAll({
            attributes: ['id', 'firstName', 'lastName', 'email', 'admin', 'instructor_only', 'phone'],
            where: {
                dibs_studio_id: dibsStudioId,
                deletedAt: {
                    [Op.ne]: null
                }
            }
        });
        console.log(`activeEmployeeAccounts is: ${JSON.stringify(activeEmployeeAccounts)}`);
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
