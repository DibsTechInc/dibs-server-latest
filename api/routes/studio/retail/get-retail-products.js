const errorHelper = require('../../../../lib/errors');

module.exports = async function getRetailProducts(req, res) {
    const { includeDeleted } = req.query;
    console.log(`\n\n\n\n\n\nGET RETAIL PRODUCTS\n\n\n\n\n\n`);
    try {
        const products = await models.retail_product.findAll({
            where: { dibs_studio_id: req.body.dibsStudioId },
            // order: [['sortIndex', 'DESC']],
            order: [['sortIndex', 'desc'], ['price']],
            paranoid: !includeDeleted
        });
        res.json(apiSuccessWrapper({ products }, 'Successfully retrieved products'));
    } catch (err) {
        errorHelper.handleError({
            opsSubject: 'Retail Lookup Error',
            employeeid: req.employee.id,
            res
        })(err);
    }
};