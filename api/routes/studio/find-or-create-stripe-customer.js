// const models = require('@dibs-tech/models');
// const moment = require('moment-timezone');
const { createNewCustomer } = require('../../../lib/stripe');

// const {
//     Sequelize: { Op }
// } = models;

async function createNewStripeCustomer(req, res) {
    const { email, name } = req.body;
    try {
        const customer = await createNewCustomer(email, name);
        console.log(`customer created is: ${JSON.stringify(customer)}`);
        res.json({
            message: 'Customer created successfully.',
            customer
        });
    } catch (err) {
        console.log(`error in createNewStripeCustomer: ${err}`);
        res.json({
            message: 'Error creating customer.',
            error: err
        });
    }
}
module.exports = createNewStripeCustomer;
