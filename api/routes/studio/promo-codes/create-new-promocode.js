const errorHelper = require('../../../../lib/errors');

module.exports = async function createNewPromoCode(req, res) {
    const { dibsStudioId, codeInfo } = req.body;
    console.log(`codeInfo is: ${JSON.stringify(codeInfo)}`);
    const {
        codename,
        amountToDiscount,
        isPercDiscount,
        expirationDate,
        studioid,
        codeUsageLimit,
        personUsageLimit,
        newClientsOnly,
        employeeId,
        applicationValue
    } = codeInfo;
    try {
        let typeToUse = 'CASH_OFF';
        if (isPercDiscount) typeToUse = 'PERCENT_OFF';
        const productToUse = applicationValue.toUpperCase();
        const employeeIdToUse = Number(employeeId);
        const promocode = await models.promo_code.create({
            amount: amountToDiscount,
            code: codename,
            type: typeToUse,
            expiration: expirationDate,
            studioid,
            source: 'zf',
            code_usage_limit: codeUsageLimit,
            user_usage_limit: personUsageLimit,
            first_time_dibs: false,
            first_time_studio_dibs: newClientsOnly,
            dibs_studio_id: dibsStudioId,
            edited: false,
            employeeid: employeeIdToUse,
            refundable: true,
            product: productToUse,
            front_desk_visible: true
        });
        if (promocode) {
            res.json({
                msg: 'success'
            });
        } else {
            res.json({
                msg: 'failure',
                error: 'Something went wrong'
            });
        }
    } catch (err) {
        res.json({
            msg: 'failure',
            error: err
        });
        errorHelper.handleError({
            opsSubject: 'createNewPromoCode Error',
            employeeid: dibsStudioId,
            res
        })(err);
    }
};
