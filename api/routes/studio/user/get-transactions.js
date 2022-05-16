const { handleError } = require('../../../../lib/helpers/error-helper');
const userLib = require('../../../../lib/users');

/**
 * getUserTransactions
 * @param {Express.Request} req HTTP request
 * @param {Express.Response} res HTTP response
 * @returns {undefined}
 */
async function getUserTransactions(req, res) {
    try {
        const { userid, dibsStudioId } = req.body;
        const { data, packageName } = await userLib.getTransactionHistory(userid, {
            type: req.params.type,
            // type: 'purchases',
            dibsStudioId,
            passid: Number(req.query.passid)
        });
        console.log(
            `\n\n\n\n\n\n\ngetUserTransactions will return --->>>>>> ${JSON.stringify(data)}\n\n\n\n\n\nAnd package name is: ${packageName}`
        );
        res.json(apiSuccessWrapper({ data, packageName }, 'Successfully got client transactions'));
    } catch (err) {
        handleError({
            opsSubject: 'GET User Transactions Error',
            res,
            resMessage: 'Something went wrong getting your transactions',
            userid: 15,
            opsIncludes: err.message
        })(err);
    }
}

module.exports = getUserTransactions;
