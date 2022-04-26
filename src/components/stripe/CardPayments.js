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
    const { clientSecret, cardInfo } = props;
    console.log(`clientSecret is (CardPayment) passed in props: ${clientSecret}`);
    console.log(`cardInfo is (CardPayment) passed in props: ${JSON.stringify(cardInfo)}`);
    const appearance = {
        theme: 'stripe'
    };
    const options = {
        clientSecret,
        appearance
    };
    if (cardInfo[0].id) {
        console.log(`client has a payment method on file`);
        const cc = `XXXX-XXXX-XXXX-${cardInfo[0].card.last4}`;
        const exp = `${cardInfo[0].card.exp_month}/${cardInfo[0].card.exp_year}`;
        return (
            <div className="stripe-payment-info">
                <div className="stripe-cc-display">
                    <span style={{ fontSize: '12px', fontWeight: '100', color: '#999' }}>Credit Card Number</span>
                    <div>{cc}</div>
                </div>
                <div className="stripe-exp-display">
                    <span style={{ fontSize: '12px', fontWeight: '100', color: '#999' }}>Exp. Date</span>
                    <div>{exp}</div>
                </div>
                <div className="stripe-exp-display">
                    <button type="submit" id="edit-cc-button">
                        Edit
                    </button>
                </div>
            </div>
        );
    }
    return (
        <Elements options={options} stripe={stripePromise}>
            <CheckoutForm clientSecret={clientSecret} />
        </Elements>
    );
};
PaymentForm.propTypes = {
    clientSecret: propTypes.string,
    exp_month: propTypes.string,
    exp_year: propTypes.string,
    cardInfo: propTypes.array
};

export default PaymentForm;
