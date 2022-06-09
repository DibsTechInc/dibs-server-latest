const models = require('@dibs-tech/models');

async function createNewEmployeeAccount(req, res) {
    try {
        const { dibsStudioId, firstname, lastname, email, phone, managerAccess } = req.body;
        const alreadyhasaccount = await models.studio_employee.findOne({
            where: {
                dibs_studio_id: dibsStudioId,
                email,
                deletedAt: null
            }
        });
        if (alreadyhasaccount) {
            res.json({
                msg: 'failure',
                error: `A staff account with this email address (${email}) already exists. Edit or disable the account by clicking on the 'View Accounts' tab above.`
            });
        }
        const employee = await models.studio_employee.createNewEmployee({
            dibs_studio_id: dibsStudioId,
            firstName: firstname,
            lastName: lastname,
            email,
            source: 'zf',
            admin: managerAccess,
            phone,
            password: 'defaultPassword'
        });
        if (phone) {
            await models.studio_employee.update(
                {
                    phone
                },
                {
                    where: {
                        id: employee.id
                    }
                }
            );
        }
        if (employee) {
            res.json({
                msg: 'success'
            });
        }
    } catch (err) {
        console.log(`\n\n\nerror in createNewEmployeeAccount api call: ${err}`);
        res.json({
            msg: 'failure',
            error: err
        });
    }
    return { msg: 'failure - createNewEmployeeAccount' };
}

module.exports = createNewEmployeeAccount;
