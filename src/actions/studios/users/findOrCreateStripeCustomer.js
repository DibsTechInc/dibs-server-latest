import axios from 'axios';

// ==============================|| CREATE NEW STRIPE CUSTOMER ||============================== //

export const findOrCreateStripeCustomer = async (email, name) => {
    try {
        const newStripeCustomer = await axios.post('/api/find-or-create-stripe-customer', {
            email,
            name
        });
        console.log(`newStripeCustomer --> ${JSON.stringify(newStripeCustomer)}`);
        return { msg: 'success', data: newStripeCustomer.data };
    } catch (err) {
        console.log(`error creating new stripe customer\nerr is: ${err}`);
    }
    return 0;
};

export default findOrCreateStripeCustomer;
