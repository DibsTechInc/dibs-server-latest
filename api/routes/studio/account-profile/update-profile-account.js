const models = require('@dibs-tech/models');

async function updateStudioProfileAccount(req, res) {
    try {
        const { employeeId, email, firstname, lastname, phonenumber } = req.body;
        await models.studio_employee.update(
            {
                firstName: firstname,
                lastName: lastname,
                email,
                phone: phonenumber
            },
            {
                where: {
                    id: employeeId
                }
            }
        );
        res.json({
            msg: 'success'
        });
    } catch (err) {
        console.log(`error in updateStudioProfileAccount api call: ${err}`);
        res.json({
            msg: 'failure',
            error: err
        });
    }
    return { msg: 'failure - updateStudioProfileAccount' };
}

module.exports = updateStudioProfileAccount;
