const models = require('@dibs-tech/models');

async function reactivateEmployeeAccount(req, res) {
    try {
        const { id } = req.body;
        const employee = await models.studio_employee.update(
            {
                deletedAt: null
            },
            {
                where: {
                    id
                },
                paranoid: false
            }
        );
        if (employee) {
            res.json({
                msg: 'success'
            });
        }
    } catch (err) {
        console.log(`\n\n\nerror in reactivateEmployeeAccount api call: ${err}`);
        res.json({
            msg: 'failure',
            error: err
        });
    }
    return { msg: 'failure - reactivateEmployeeAccount' };
}

module.exports = reactivateEmployeeAccount;
