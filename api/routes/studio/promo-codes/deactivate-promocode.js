const models = require('@dibs-tech/models');

async function deactivatePromoCode(req, res) {
    try {
        const { promoid } = req.body;
        const promoCode = await models.promo_code.update(
            {
                expiration: new Date()
            },
            {
                where: {
                    id: promoid
                }
            }
        );
        if (promoCode) {
            res.json({
                msg: 'success'
            });
        }
    } catch (err) {
        console.log(`\n\n\nerror in deactivate promocode api call: ${err}`);
        res.json({
            msg: 'failure',
            error: err
        });
    }
    return { msg: 'failure - deactivatePromoCode' };
}

module.exports = deactivatePromoCode;
