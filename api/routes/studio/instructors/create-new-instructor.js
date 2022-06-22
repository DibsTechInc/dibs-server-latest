const models = require('@dibs-tech/models');

async function createNewInstructor(req, res) {
    try {
        const { dibsStudioId, firstname, lastname, email, phone, studioid } = req.body;
        const alreadyhasaccount = await models.dibs_studio_instructors.findOne({
            where: {
                dibs_studio_id: dibsStudioId,
                firstname,
                lastname
            }
        });
        if (alreadyhasaccount) {
            res.json({
                msg: 'failure',
                error: `An instructor with this name (${firstname} ${lastname}) already exists. Please use a different name.`
            });
        }
        const instructor = await models.dibs_studio_instructors.create({
            dibs_studio_id: dibsStudioId,
            studioid,
            source: 'zf',
            firstname,
            lastname,
            email,
            enabled: true,
            mobilephone: phone
        });
        if (instructor) {
            res.json({
                msg: 'success'
            });
        }
    } catch (err) {
        console.log(`\n\n\nerror in createNewInstructor api call: ${err}`);
        res.json({
            msg: 'failure',
            error: err
        });
    }
    return { msg: 'failure - createNewInstructor' };
}

module.exports = createNewInstructor;
