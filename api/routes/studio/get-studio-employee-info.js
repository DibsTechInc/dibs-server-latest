const models = require('@dibs-tech/models');

async function getStudioEmployee(req, res) {
    try {
        const userEmployee = await models.studio_employee.findOne({
            attributes: [
                'id',
                ['dibs_studio_id', 'dibsStudioId'],
                'firstName',
                'lastName',
                'email',
                'admin',
                'phone',
                'profile_picture',
                'last_login',
                'demo_account',
                'instructor_only'
            ],
            where: {
                email: req.body.email,
                deletedAt: null
            }
        });
        const values = { last_login: new Date() };
        const condition = { where: { id: userEmployee.id } };
        const options = { multi: true };

        models.studio_employee.update(values, condition, options).then((upresult) => {
            console.log(`Updated ${upresult} row`);
        });
        res.json({
            msg: 'success',
            employee: userEmployee
        });
    } catch (err) {
        console.log(`error in getStudioEmployee api call: ${err}`);
        return err;
    }
    return { msg: 'failure - getStudioEmployee' };
}

module.exports = getStudioEmployee;
