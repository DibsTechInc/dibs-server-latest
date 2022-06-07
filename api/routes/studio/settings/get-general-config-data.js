const models = require('@dibs-tech/models');

async function getGeneralConfigData(req, res) {
    try {
        const { dibsStudioId } = req.body;
        const studioconfigdata = await models.dibs_config.findOne({
            attributes: [
                'terms',
                'color',
                'interval_end',
                'autopayNotice',
                'use_spot_booking',
                'show_credit_load',
                'first_class_fixed_price',
                'display_giftcards',
                'spot_label',
                'vod_access_period',
                'raf_award'
            ],
            where: {
                dibs_studio_id: dibsStudioId
            }
        });
        const imageUrls = await models.dibs_studio.findOne({
            attributes: ['color_logo', 'hero_url'],
            where: {
                id: dibsStudioId
            }
        });
        const cancelTime = await models.dibs_studio.findOne({
            attributes: ['cancel_time'],
            where: {
                id: dibsStudioId
            }
        });
        console.log(`\n\n\n\ngeneralconfigdata is: ${JSON.stringify(studioconfigdata)}`);
        res.json({
            msg: 'success',
            studioconfigdata,
            imageUrls,
            cancelTime: cancelTime.cancel_time
        });
    } catch (err) {
        console.log(`error in getGeneralConfigData api call: ${err}`);
        res.json({
            msg: 'failure',
            error: err
        });
    }
    return { msg: 'failure - getGeneralConfigData' };
}

module.exports = getGeneralConfigData;
