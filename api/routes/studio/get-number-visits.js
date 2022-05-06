const models = require('@dibs-tech/models');

async function getNumberVisits(req, res) {
    try {
        console.log(`req.body = ${JSON.stringify(req.body)}`);
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
        console.log(`\n\n\n\nnumVisits is: ${JSON.stringify(numVisits)}`);
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
