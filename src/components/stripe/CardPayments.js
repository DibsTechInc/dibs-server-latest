// import React from 'react';
// import ReactDOM from 'react-dom';
import propTypes from 'prop-types';
import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
// import Payment from 'views/application/e-commerce/Checkout/Payment';

const stripePromise = loadStripe('pk_test_7PNwQZV5OJNWDC2wh7RoqePN', {
    apiVersion: '2020-08-27'
});

const PaymentForm = (props) => {
    const { clientSecret } = props;
    console.log(`clientSecret is (CardPayment): ${clientSecret}`);
    const appearance = {
        theme: 'stripe'
    };
    const options = {
        clientSecret,
        appearance
    };
    return (
        <Elements options={options} stripe={stripePromise}>
            <CheckoutForm clientSecret={clientSecret} />
        </Elements>
    );
};
PaymentForm.propTypes = {
    clientSecret: propTypes.string
};

export default PaymentForm;
