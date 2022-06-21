const models = require('@dibs-tech/models');

async function deactivateInstructor(req, res) {
    try {
        const { id } = req.body;
        const instructor = await models.dibs_studio_instructors.update(
            {
                enabled: false
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
        console.log(`\n\n\nerror in deactivateInstructor api call: ${err}`);
        res.json({
            msg: 'failure',
            error: err
        });
    }
    return { msg: 'failure - deactivateInstructor' };
}

module.exports = deactivateInstructor;
