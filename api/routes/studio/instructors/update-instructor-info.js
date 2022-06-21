const models = require('@dibs-tech/models');

async function updateInstructorInfo(req, res) {
    try {
        const { id, firstname, lastname, email, phone, imageUrl } = req.body;
        let phoneUpdate = phone;
        if (phone === 'N/A') {
            phoneUpdate = null;
        }
        const instructor = await models.dibs_studio_instructors.update(
            {
                firstname,
                lastname,
                email,
                mobilephone: phoneUpdate,
                image_url: imageUrl
            },
            {
                where: {
                    id
                }
            }
        );
        if (instructor) {
            res.json({
                msg: 'success'
            });
        }
    } catch (err) {
        console.log(`\n\n\nerror in updateInstructorInfo api call: ${err}`);
        res.json({
            msg: 'failure',
            error: err
        });
    }
    return { msg: 'failure - updateInstructorInfo' };
}

module.exports = updateInstructorInfo;
