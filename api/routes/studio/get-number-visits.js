const models = require('@dibs-tech/models');

async function getNumberVisits(req, res) {
    try {
        const { userid, dibsStudioId } = req.body;
        let visits = 0;
        const numVisits = await models.attendees.count({
            where: {
                dibs_studio_id: dibsStudioId,
                userid,
                dropped: false,
                checkedin: true
            }
        });
        visits = numVisits;
        res.json({
            msg: 'success',
            numVisits: visits
        });
    } catch (err) {
        console.log(`error in getNumberVisits api call: ${err}`);
        return err;
    }
    return { msg: 'failure - getNumberVisits' };
}

module.exports = getNumberVisits;
