const models = require('@dibs-tech/models');

async function deactivateEmployeeAccount(req, res) {
    try {
        const { id } = req.body;
        const employee = await models.studio_employee.update(
            {
                deletedAt: new Date()
            },
            {
                where: {
                    id
                }
            }
        );
        if (employee) {
            res.json({
                msg: 'success'
            });
        }
    } catch (err) {
        console.log(`\n\n\nerror in deactivateEmployeeAccount api call: ${err}`);
        res.json({
            msg: 'failure',
            error: err
        });
    }
    return { msg: 'failure - deactivateEmployeeAccount' };
}

module.exports = deactivateEmployeeAccount;
