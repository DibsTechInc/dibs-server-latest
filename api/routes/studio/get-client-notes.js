const models = require('@dibs-tech/models');

async function getClientNotes(req, res) {
    try {
        const { userid, dibsStudioId } = req.body;
        const notesfromdb = await models.dibs_user_studio.findOne({
            attributes: ['id', 'client_notes', 'showed_vax_proof'],
            where: {
                userid,
                dibs_studio_id: dibsStudioId
            }
        });
        if (notesfromdb) {
            res.json({
                msg: 'success',
                clientNotes: notesfromdb.client_notes
            });
        } else {
            res.json({
                msg: 'success',
                clientNotes: 'This client does not have any notes yet.'
            });
        }
    } catch (err) {
        console.log(`error in getClientNotes api call: ${err}`);
        return err;
    }
    return { msg: 'failure - getClientNotes' };
}

module.exports = getClientNotes;
