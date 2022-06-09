const models = require('@dibs-tech/models');

async function updateBillingContact(req, res) {
    try {
        const { dibsStudioId, billingContact, billingEmail } = req.body;
        console.log(`billingContact: ${billingContact}`);
        await models.dibs_studio.update(
            {
                billing_contact: billingContact,
                billing_email: billingEmail
            },
            {
                where: {
                    id: dibsStudioId
                }
            }
        );
        res.json({
            msg: 'success'
        });
    } catch (err) {
        console.log(`error in updateBillingContact api call: ${err}`);
        res.json({
            msg: 'failure',
            error: err
        });
    }
    return { msg: 'failure - updateBillingContact' };
}

module.exports = updateBillingContact;
