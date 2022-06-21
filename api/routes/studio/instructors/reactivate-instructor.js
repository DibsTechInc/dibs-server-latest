const models = require('@dibs-tech/models');

async function reactivateInstructor(req, res) {
    try {
        const { id } = req.body;
        const instructor = await models.dibs_studio_instructors.update(
            {
                enabled: true
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
        console.log(`\n\n\nerror in reactivateInstructor api call: ${err}`);
        res.json({
            msg: 'failure',
            error: err
        });
    }
    return { msg: 'failure - reactivateInstructor' };
}

module.exports = reactivateInstructor;
