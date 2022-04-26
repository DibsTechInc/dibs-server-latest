const models = require('@dibs-tech/models');

async function getClientInfo(req, res) {
    try {
        console.log(`req.body = ${JSON.stringify(req.body)}`);
        const clientInfo = await models.dibs_user.findOne({
            attributes: [
                'firstName',
                'lastName',
                'email',
                'mobilephone',
                'city',
                'state',
                'zip',
                'birthday',
                'pictureUrl',
                'stripeid',
                'stripe_cardid',
                'emergencycontactname',
                'emergencycontactemail',
                'emergencycontactphone',
                'createdAt',
                'campaign_notification',
                'waiverSigned',
                'snooze_flash_credits_until',
                'venmo_name',
                'proof_of_vax',
                'suppression_lists'
            ],
            where: {
                id: req.body.userid,
                deletedAt: null
            }
        });
        let studioStripeId = '';
        if (clientInfo) {
            const studioStripeInfo = await models.dibs_user_studio.findOne({
                attributes: ['stripe_customer_id'],
                where: {
                    userid: req.body.userid,
                    dibs_studio_id: req.body.dibsStudioId
                }
            });
            if (studioStripeInfo) {
                studioStripeId = studioStripeInfo.stripe_customer_id;
            }
        }

        res.json({
            msg: 'success',
            userInfo: clientInfo,
            studioStripeId
        });
    } catch (err) {
        console.log(`error in getClientInfo api call: ${err}`);
        return err;
    }
    return { msg: 'failure - getClientInfo' };
}

module.exports = getClientInfo;
