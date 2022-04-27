// import React from 'react';
// import ReactDOM from 'react-dom';
import propTypes from 'prop-types';
import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';

import CheckoutForm from './CheckoutForm';
// import Payment from 'views/application/e-commerce/Checkout/Payment';

// const stripePromise = loadStripe('pk_test_7PNwQZV5OJNWDC2wh7RoqePN', {
//     apiVersion: '2020-08-27'
// });

const PaymentForm = (props) => {
    // const { clientSecret, dibsCardInfo, studioCardInfo, hasPaymentMethod, setCardValueChanged, addSpace } = props;
    const { clientSecret, studioCardInfo, hasPaymentMethod, setCardValueChanged, addSpace } = props;
    // eslint-disable-next-line no-unused-vars
    const [stripePromise, setStripePromise] = useState(() => loadStripe('pk_test_7PNwQZV5OJNWDC2wh7RoqePN', { apiVersion: '2020-08-27' }));
    const appearance = {
        theme: 'stripe'
    };
    const options = {
        clientSecret,
        appearance
    };
    if (studioCardInfo) {
        const cc = `XXXX-XXXX-XXXX-${studioCardInfo[0].card.last4}`;
        const exp = `${studioCardInfo[0].card.exp_month}/${studioCardInfo[0].card.exp_year}`;
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
    if (!hasPaymentMethod) {
        return (
            <Elements id="stripe-checkout" options={options} stripe={stripePromise}>
                <CheckoutForm clientSecret={clientSecret} setCardValueChanged={setCardValueChanged} addSpace={addSpace} />
            </Elements>
        );
    }
    return <div>working on it</div>;
};
PaymentForm.propTypes = {
    clientSecret: propTypes.string,
    exp_month: propTypes.string,
    exp_year: propTypes.string,
    studioCardInfo: propTypes.array,
    // dibsCardInfo: propTypes.array,
    hasPaymentMethod: propTypes.bool,
    setCardValueChanged: propTypes.func,
    addSpace: propTypes.bool
};

export default PaymentForm;
