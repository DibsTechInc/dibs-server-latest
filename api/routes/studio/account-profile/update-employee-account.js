const models = require('@dibs-tech/models');

async function updateEmployeeAccount(req, res) {
    try {
        const { id, firstname, lastname, email, phone, managerAccess } = req.body;
        let phoneUpdate = phone;
        if (phone === 'N/A') {
            phoneUpdate = null;
        }
        const employee = await models.studio_employee.update(
            {
                firstName: firstname,
                lastName: lastname,
                email,
                admin: managerAccess,
                phone: phoneUpdate
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
        console.log(`\n\n\nerror in updateEmployeeAccount api call: ${err}`);
        res.json({
            msg: 'failure',
            error: err
        });
    }
    return { msg: 'failure - updateEmployeeAccount' };
}

module.exports = updateEmployeeAccount;
