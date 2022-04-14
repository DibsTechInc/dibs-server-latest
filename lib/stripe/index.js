const sc = require('stripe')(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27'
});

const stripeLib = {};

stripeLib.createNewCustomer = async function createCustomer(email, name) {
    try {
        const customer = await sc.customers.create({
            email,
            name
        });
        console.log(` stripe library - customer created is: ${JSON.stringify(customer)}`);
        return customer;
    } catch (err) {
        console.log(`error in createCustomer: ${err}`);
        return null;
    }
};

module.exports = stripeLib;
